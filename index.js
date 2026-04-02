import express from "express"
import dotevn from "dotenv"
import mongoose from "mongoose"
import Contact from "./models/contacts.models.js"

dotevn.config({
    path: "./.env"
})

const app = express()
const port = process.env.PORT || 3000

// database connection
mongoose.connect('mongodb://127.0.0.1:27017/contacts-crud')
.then(() => {console.log("Database Connected")})

// middlewares
app.set('view engine', 'ejs')
// app.set('views', 'mydirectory')
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

// Routes
app.get('/', async (req,res) => {
    const contacts = await Contact.find()
    // res.json(contacts)
    res.render('home',{contacts})
})

app.get('/show-contact/:id', async (req,res) => {
    // const contact = await Contact.findOne({_id: req.params.id})
    const contact = await Contact.findById(req.params.id)
    // res.json(contact)
    res.render('show-contact',{contact})
})

app.get('/add-contact', (req,res) => {
    res.render('add-contact')
})

app.post('/add-contact',async (req,res) => {
    await Contact.create(req.body) 
    // res.send(req.body)
    res.redirect('/')

})

app.get('/update-contact/:id', async (req,res) => {
    const contact = await Contact.findById(req.params.id)
    res.render('update-contact',{contact})
})

app.post('/update-contact/:id', async (req,res) => {
    await Contact.findByIdAndUpdate(req.params.id, req.body)
    res.redirect('/')
})

app.get('/delete-contact/:id', (req,res) => {})

app.listen(port,() => {
    console.log(`server is running successful on http://localhost:${port}`)
})