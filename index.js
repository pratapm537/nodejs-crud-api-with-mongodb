import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/database.js"
import ContactRoute from "./routes/contacts.routes.js"

const app = express()
dotenv.config({path: "./.env"})

const port = process.env.PORT || 3000

//ejs configration
app.set("view engine","ejs")
// app.set("views","mydirectory")

// basic configration
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

// database connection
connectDB()

// route
app.use("/",ContactRoute)


app.listen(port, ()=> {
    console.log(`Server is running on port http://localhost:${port}`)
})