const mongoose=require("mongoose");
mongoose.connect("mongodb://0.0.0.0:27017/Antilostglasses");
const express=require("express");
const app=express();

const userRoute=require('./routes/userRoutes');
app.use('/',userRoute);
const port=process.env.PORT||3000;
app.get("/",(req,res)=>{
    res.send("Shri SHivay Namastubhyam");
});
//for user routes

app.listen(port,()=>{
    console.log(`Server is running at port ${port}`);
});