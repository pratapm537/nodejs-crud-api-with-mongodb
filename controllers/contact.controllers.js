import mongoose from "mongoose"
import Contact from "../models/contacts.models.js"

export const getContacts = async (req,res) => {
    try {
        const contacts = await Contact.find()
        // res.json(contacts)
        res.render('home',{contacts})
    } catch (error) {
        res.renderO("500", {message: error})
    }
    
}

export const getContact = async (req,res) => {
    // const contact = await Contact.findOne({_id: req.params.id})
    const paramId = mongoose.Types.ObjectId.isValid(req.params.id)
    if(!paramId){
        res.render("404",{message: "Invalid Id"})
    }

    try{
        const contact = await Contact.findById(req.params.id)
        if(!contact) return res.render("500", {message: "Contact Not Found"})
        // res.json(contact)
        res.render('show-contact',{contact})
    } catch(error){
        res.render("500", {message: error})
    }
}

export const addContactPage = (req,res) => {
    res.render('add-contact')
}

export const addContact = async (req,res) => {
    try {
        await Contact.create(req.body) 
        // res.send(req.body)
        res.redirect('/')
    } catch (error) {
        res.render("500",{message: error})
    }
    

}

export const updateContactPage =  async (req,res) => {
    const paramId = mongoose.Types.ObjectId.isValid(req.params.id)
    if(!paramId){
        res.render("404", {message: "Invalid Id"})
    }

    try {
        const contact = await Contact.findById(req.params.id)
        if(!contact) return res.render("500", {message: "Contact Not Found"})
        res.render('update-contact',{contact})
    } catch (error) {
        res.render("500", {message: error})
    }
    
}

export const updateContact =  async (req,res) => {
    const paramId = mongoose.Types.ObjectId.isValid(req.params.id)
    if(!paramId){
        res.render("404", {message: "Invalid Id"})
    }

    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body)
        if(!contact) return res.render("500", {message: "Contact Not Found"})        
        res.redirect('/')
    } catch (error) {
        res.render("500", {message: error})
    }
    
}

export const deleteContact =  async (req,res) => {
    const paramId = mongoose.Types.ObjectId.isValid(req.params.id)
    if(!paramId){
        res.render("404",{message: "Invalid Id"})
    }
    try {
        
    } catch (error) {
        const contact = await Contact.findByIdAndDelete(req.params.id)
        if(!contact) return res.render("500", "Contact Not Found")
        res.redirect('/')
    }
    
}

