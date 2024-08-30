const express=require("express")
require('dotenv').config()
const UserRoutes=require("./Routes/User")
const connectMongoDB = require("./config/connection")

const app=express()
const URI=process.env.MONGODB_URI
const port= process.env.PORT || 8000 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", UserRoutes)
connectMongoDB(URI)

app.listen(port,()=>{
    console.log("Server started");   
})