import Contact from "../models/contacts.models.js"

export const getContacts = async (req,res) => {
    const contacts = await Contact.find()
    // res.json(contacts)
    res.render('home',{contacts})
}

export const getContact = async (req,res) => {
    // const contact = await Contact.findOne({_id: req.params.id})
    const contact = await Contact.findById(req.params.id)
    // res.json(contact)
    res.render('show-contact',{contact})
}

export const addContactPage = (req,res) => {
    res.render('add-contact')
}

export const addContact = async (req,res) => {
    await Contact.create(req.body) 
    // res.send(req.body)
    res.redirect('/')

}

export const updateContactPage =  async (req,res) => {
    const contact = await Contact.findById(req.params.id)
    res.render('update-contact',{contact})
}

export const updateContact =  async (req,res) => {
    await Contact.findByIdAndUpdate(req.params.id, req.body)
    res.redirect('/')
}

export const deleteContact =  async (req,res) => {
    await Contact.findByIdAndDelete(req.params.id)
    res.redirect('/')
}