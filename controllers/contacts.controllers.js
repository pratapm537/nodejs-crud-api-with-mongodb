import Contact from "../models/contacts.models.js"
import mongoose from "mongoose"


export const getContacts =  async (req,res)=> {
    try {
        const contacts = await Contact.find()
        res.render("home",{contacts})
    } catch (error) {
        console.error(error)
    }  
}

export const showContactPage = async(req,res)=> {
    const paramId = mongoose.Types.ObjectId.isValid(req.params.id)
    if(!paramId) return res.render("500",{message: "Contact Detail Not Found"})
    try {
        const contact = await Contact.findById(req.params.id)
        if(!contact) return res.render("404",{message: "Invalid Id"})
        res.render("show-contact",{contact})
    } catch (error) {
        console.error(error)
    }
}

export const addContactPage =  (req,res)=> {
    try {
        res.render("add-contact")
    } catch (error) {
        console.error(error)
    }
}

export const addContact = async(req,res)=> {
        try {
           const contact = await Contact.insertOne(req.body)
            res.redirect("/") 
        } catch (error) {
           console.error(error) 
        }
    }

export const updateContactPage = async (req,res)=> {
    const paramId = mongoose.Types.ObjectId.isValid(req.params.id)
    if(!paramId) return res.render("500",{message: "Contact Detail Not Found"})
    try {
        const contact = await Contact.findById(req.params.id)
        if(!contact) return res.render("404",{message: "Invalid ID"})
        res.render("update-contact",{contact})
    } catch (error) {
        console.error(error)
    }
    
}

export const updateContact =  async (req,res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body)
        res.redirect("/")
    } catch (error) {
        console.error(error)
    }
    
}

export const deleteContact = async (req,res)=> {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id)
        res.redirect("/")
    } catch (error) {
        console.error(error)
    }
}