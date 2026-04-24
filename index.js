import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/database.js"
import ContactRoute from "./routes/contacts.routes.js"
import cors from "cors"

const app = express()
dotenv.config({path: "./.env"})

const port = process.env.PORT || 3000

// app.set("view engine","ejs")
// app.set("views","mydirectory")
app.use(cors())

// basic configration
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

// database connection
connectDB()

// route
app.use("/api/contacts",ContactRoute)


app.listen(port, ()=> {
    console.log(`Server is running on port http://localhost:${port}`)
})