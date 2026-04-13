import express from "express"
import { getContacts,showContactPage,updateContactPage,updateContact,deleteContact, addContactPage, addContact } from "../controllers/contacts.controllers.js"

const route = express.Router()

route.get("/",getContacts)

route.get("/show-contact/:id",showContactPage)

route.get("/add-contact",addContactPage)

route.post("/add-contact",addContact)

route.get("/update-contact/:id",updateContactPage)

route.post("/update-contact/:id",updateContact)

route.get("/delete-contact/:id",deleteContact)

export default route

