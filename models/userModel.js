const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    name:{
       type:String,
       required:true,
    },
    email:{
        type:String,
        required:true
     },
     mobileNo:{
        type:String,
        required:true
     },
     image:{
        type:String,
        required:true
     },
     password:{
        type:String,
        required:true
     },
     is_Admin:{
        type:Number,
        required:true
     },
     is_verified:{
        type:Number,
        default:0
     },
     token:{
      type:String,
      default:''
     }

});
module.exports=mongoose.model("AntiLG",userSchema);