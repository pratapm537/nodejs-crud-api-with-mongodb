import express from "express"
import dotevn from "dotenv"

dotevn.config({
    path: "./.env"
})

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req,res) => {
    res.send("<h1>Welcome to Home Pages</h1>")
})


app.listen(port,() => {
    console.log(`server is running successful on http://localhost:${port}`)
})