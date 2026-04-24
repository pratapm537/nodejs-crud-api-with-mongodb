import express from "express"
import multer from "multer"
import {
    getContacts,
    getContact,
    updateContact,
    deleteContact,
    addContact,
    downloadPdf,
    downloadCsv,
    downloadExcel,
    importContacts
} from "../controllers/contacts.controllers.js"

const route = express.Router()
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
})

route.get("/", getContacts)
route.get("/download/pdf", downloadPdf)
route.get("/download/csv", downloadCsv)
route.get("/download/excel", downloadExcel)
route.post("/import", upload.single("file"), importContacts)
route.get("/:id", getContact)
route.post("/", addContact)
route.put("/:id", updateContact)
route.delete("/:id", deleteContact)

export default route
