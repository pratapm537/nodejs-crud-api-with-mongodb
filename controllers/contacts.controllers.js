import Contact from "../models/contacts.models.js"
import mongoose from "mongoose"
import PDFDocument from "pdfkit-table"
import * as XLSX from "xlsx"
import path from "path"

const SEARCH_FIELDS = ["first_name", "last_name", "email", "phone", "address"]

const escapeRegExp = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const buildSearchFilter = (query, field) => {
    if (!query) return {}
    const regex = new RegExp(escapeRegExp(query), "i")
    if (SEARCH_FIELDS.includes(field)) {
        return { [field]: regex }
    }
    return { $or: SEARCH_FIELDS.map((key) => ({ [key]: regex })) }
}

const toText = (value) => {
    if (value === null || value === undefined) return ""
    return String(value).trim()
}

const normalizeHeader = (value = "") =>
    value
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim()

const HEADER_ALIASES = {
    "first name": "first_name",
    "firstname": "first_name",
    "first_name": "first_name",
    "first": "first_name",
    "last name": "last_name",
    "lastname": "last_name",
    "last_name": "last_name",
    "last": "last_name",
    "email": "email",
    "email address": "email",
    "email_address": "email",
    "phone": "phone",
    "phone number": "phone",
    "phone_number": "phone",
    "mobile": "phone",
    "address": "address",
    "location": "address"
}

const mapRowToContact = (row) => {
    const contact = {}
    Object.entries(row || {}).forEach(([key, value]) => {
        const normalized = normalizeHeader(key)
        const field = HEADER_ALIASES[normalized]
        if (field) {
            contact[field] = toText(value)
        }
    })
    return contact
}

const hasContactData = (contact) =>
    SEARCH_FIELDS.some((key) => Boolean(contact?.[key]))

const escapeCsvValue = (value) => {
    const text = toText(value)
    if (!text) return ""
    if (/[",\n]/.test(text)) {
        return `"${text.replace(/"/g, '""')}"`
    }
    return text
}

const parseCsvRows = (text = "") => {
    const rows = []
    let field = ""
    let row = []
    let inQuotes = false

    for (let i = 0; i < text.length; i += 1) {
        const char = text[i]
        if (inQuotes) {
            if (char === '"') {
                if (text[i + 1] === '"') {
                    field += '"'
                    i += 1
                } else {
                    inQuotes = false
                }
            } else {
                field += char
            }
        } else {
            if (char === '"') {
                inQuotes = true
            } else if (char === ",") {
                row.push(field)
                field = ""
            } else if (char === "\n") {
                row.push(field)
                rows.push(row)
                row = []
                field = ""
            } else if (char !== "\r") {
                field += char
            }
        }
    }

    row.push(field)
    rows.push(row)

    return rows.filter((values) => values.some((value) => value.trim() !== ""))
}

const csvRowsToObjects = (rows) => {
    if (!rows.length) return []
    const [headerRow, ...dataRows] = rows
    if (!headerRow.length) return []
    const headers = [...headerRow]
    headers[0] = headers[0].replace(/^\uFEFF/, "")
    return dataRows.map((values) => {
        const obj = {}
        headers.forEach((header, index) => {
            obj[header] = values[index] ?? ""
        })
        return obj
    })
}

export const getContacts = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = 5;
        const skip = (page - 1) * limit;
        const search = req.query.q ? String(req.query.q).trim() : "";
        const field = req.query.field ? String(req.query.field).trim() : "all";
        const filter = buildSearchFilter(search, field);

        const totalContacts = await Contact.countDocuments(filter);
        const totalPages = Math.ceil(totalContacts / limit);

        const contacts = await Contact.find(filter).skip(skip).limit(limit);
        res.status(200).json({
            contacts,
            currentPage: page,
            totalPages,
            totalContacts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const getContact = async (req, res) => {
    const paramId = mongoose.Types.ObjectId.isValid(req.params.id)
    if (!paramId) return res.status(400).json({ message: "Invalid ID Format" });
    try {
        const contact = await Contact.findById(req.params.id)
        if (!contact) return res.status(404).json({ message: "Contact Not Found" });
        res.status(200).json({ contact });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const addContact = async (req, res) => {
    try {
        // Mongoose 6+ Model.create or new Contact().save() is better. Wait, the original code used insertOne but mongoose uses create(). Let's use create.
        const contact = await Contact.create(req.body);
        res.status(201).json({ message: "Contact created successfully", contact });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating contact", error: error.message });
    }
}

export const updateContact = async (req, res) => {
    const paramId = mongoose.Types.ObjectId.isValid(req.params.id)
    if (!paramId) return res.status(400).json({ message: "Invalid ID Format" });
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!contact) return res.status(404).json({ message: "Contact Not Found" });
        res.status(200).json({ message: "Contact updated successfully", contact });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating contact", error: error.message });
    }
}

export const deleteContact = async (req, res) => {
    const paramId = mongoose.Types.ObjectId.isValid(req.params.id)
    if (!paramId) return res.status(400).json({ message: "Invalid ID Format" });
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id)
        if (!contact) return res.status(404).json({ message: "Contact Not Found" });
        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting contact", error: error.message });
    }
}

export const downloadPdf = async (req, res) => {
    try {
        const contacts = await Contact.find();
        
        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        
        res.setHeader('Content-disposition', 'attachment; filename=contacts.pdf');
        res.setHeader('Content-type', 'application/pdf');
        // Let CORS allow this headers
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        
        doc.pipe(res);
        
        doc.fontSize(20).text('All Contacts Record', { align: 'center' });
        doc.moveDown();

        const table = {
            headers: ["No.", "First Name", "Last Name", "Email Address", "Phone"],
            rows: contacts.map((c, i) => [
                String(i + 1),
                c.first_name,
                c.last_name,
                c.email,
                c.phone
            ])
        };

        await doc.table(table, { 
            prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
            prepareRow: () => doc.font("Helvetica").fontSize(10)
        });
        
        doc.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error generating PDF" });
    }
}

export const downloadCsv = async (req, res) => {
    try {
        const contacts = await Contact.find();
        const headers = ["First Name", "Last Name", "Email", "Phone", "Address"];
        const rows = contacts.map((c) => [
            escapeCsvValue(c.first_name),
            escapeCsvValue(c.last_name),
            escapeCsvValue(c.email),
            escapeCsvValue(c.phone),
            escapeCsvValue(c.address)
        ]);

        const csvContent = `\uFEFF${[headers.join(","), ...rows.map((r) => r.join(","))].join("\n")}`;

        res.setHeader("Content-disposition", "attachment; filename=contacts.csv");
        res.setHeader("Content-type", "text/csv; charset=utf-8");
        res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
        res.status(200).send(csvContent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error generating CSV" });
    }
}

export const downloadExcel = async (req, res) => {
    try {
        const contacts = await Contact.find();
        const data = contacts.map((c) => ({
            "First Name": toText(c.first_name),
            "Last Name": toText(c.last_name),
            Email: toText(c.email),
            Phone: toText(c.phone),
            Address: toText(c.address)
        }));

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");

        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        res.setHeader("Content-disposition", "attachment; filename=contacts.xlsx");
        res.setHeader(
            "Content-type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
        res.status(200).send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error generating Excel file" });
    }
}

export const importContacts = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload a CSV or Excel file." });
        }

        const ext = path.extname(req.file.originalname).toLowerCase();
        const allowed = [".csv", ".xlsx", ".xls"];
        if (!allowed.includes(ext)) {
            return res.status(400).json({ message: "Unsupported file type. Use CSV or Excel." });
        }

        let rows = [];
        if (ext === ".csv") {
            const csvText = req.file.buffer.toString("utf8");
            const parsedRows = parseCsvRows(csvText);
            rows = csvRowsToObjects(parsedRows);
        } else {
            const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            if (!sheetName) {
                return res.status(400).json({ message: "No worksheet found in the file." });
            }
            const worksheet = workbook.Sheets[sheetName];
            rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        }

        const contacts = rows
            .map(mapRowToContact)
            .filter((contact) => hasContactData(contact));

        if (!contacts.length) {
            return res.status(400).json({ message: "No valid rows found to import." });
        }

        const insertedDocs = await Contact.insertMany(contacts);

        res.status(200).json({
            message: "Contacts imported successfully",
            inserted: insertedDocs.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error importing contacts", error: error.message });
    }
}
