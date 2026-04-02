import express from "express"
import dotevn from "dotenv"
import ContactRoutes from "./routes/contacts.routes.js"
import {connectDB} from "./config/database.js"

dotevn.config({
    path: "./.env"
})

const app = express()
const port = process.env.PORT || 3000

// database connection
connectDB()

// middlewares
app.set('view engine', 'ejs')
// app.set('views', 'mydirectory')
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))


// Routes
app.use('/',ContactRoutes)

app.listen(port,() => {
    console.log(`server is running successful on http://localhost:${port}`)
})
