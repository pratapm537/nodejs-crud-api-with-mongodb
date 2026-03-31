import express from "express"
import dotevn from "dotenv"

dotevn.config({
    path: "./.env"
})

const app = express()
const port = process.env.PORT || 3000

// middlewares
app.set('view engine', 'ejs')
// app.set('views', 'mydirectory')
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

// Routes
app.get('/', (req,res) => {
    res.render('home')
})

app.get('/show-contact', (req,res) => {
    res.send("Welcome To Show Contact Page")
})

app.get('/add-contact', (req,res) => {
    res.render('add-contact')
})

app.post('/add-contact',(req,res) => {

})

app.get('/update-contact', (req,res) => {
    res.render('update-contact')
})

app.post('/update-contact', (req,res) => {
    
})

app.get('/delete-contact', (req,res) => {})

app.listen(port,() => {
    console.log(`server is running successful on http://localhost:${port}`)
})