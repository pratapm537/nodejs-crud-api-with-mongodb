import express from "express"
import dotevn from "dotenv"

dotevn.config({
    path: "./.env"
})

const app = express()
const port = process.env.PORT || 3000

// Routes
app.get('/', (req,res) => {
    res.send("<h1>Welcome to Home Pages</h1>")
})

app.get('/show-contact', (req,res) => {
    res.send("Welcome To Show Contact Page")
})

app.get('/add-contact', (req,res) => {
    res.send("Welcome to Add New Contact Page")
})

app.post('/add-contact',(req,res) => {

})

app.get('/delete-contact', (req,res) => {})

app.get('/update-contact', (req,res) => {
    res.send("Welcome to Update Contact Page")
})

app.post('/update-contact', (res,res) => {

})


app.listen(port,() => {
    console.log(`server is running successful on http://localhost:${port}`)
})