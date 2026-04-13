import mongoose from "mongoose";

export const connectDB = ()=> {
    try {
        mongoose.connect("mongodb://127.0.0.1:27017/contacts-curd8")
        .then(()=> {console.log("Database Connected")})
    } catch (error) {
        console.log(error)
    }
}