const User=require("../models/userModel");
const bcrypt=require("bcrypt");
const nodemailer=require("nodemailer");
const randomstring=require("randomstring");
const config=require("../config/config");



const securePassword=async(password)=>{
  try {
     const passwordhash=await bcrypt.hash(password,10);
     return passwordhash;

  } catch (error) {
    console.log(error.message);
  }
}

const sendVerifyMail=async(name,email,user_id)=>{
  try {
    

    const transporter=nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        requireTLS:true,
        auth:{
            user:config.emailUser,
            pass:config.emailPassword,
        }
    });
    const mailOptions={
        from:config.emailUser,
        to:email,
        subject:'for verification mail',
        html:'<p>Hii'+name+',please click here to <a href="http://localhost:3000/verify?id='+user_id+'">verify</a>your mail. </p>'
    }
    transporter.sendMail(mailOptions,function(error,info){
          if(error)
          {
             console.log(error);
          }
          else{
         console.log("Email has been sent :-",info.response);
          }
    })
  } catch (error) {
    console.log(error.message);
  }
}


const LoadRegister=async(req,res)=>{
    try {
        res.render('registeration');
    } catch (error) {
        console.log(error.message);
        
    }
}


const InsertUser=async(req,res)=>{
    try {
        const spassword= await securePassword(req.body.password)
        const user=new User({
            name:req.body.name,
            email:req.body.email,
            mobileNo:req.body.mobileNo,
            image:req.file.filename,
            password:spassword,
            is_Admin:0,
          

        })
        const userData=await user.save();
        if(userData)
        {
            sendVerifyMail(req.body.name,req.body.email,userData._id);
            res.render('registeration',{message:"Your registration has been successfully recorded,please verify your mail"});

        }
        else
        {
            res.render('registeration',{message:"Your registration has been failed"});
        }
    } catch (error) {
        console.log(error.message);
    }
}

const verifyMail=async(req,res)=>{
    try {
        const updateInfo=await User.updateOne({_id:req.query.id},{$set:{ is_verified:1}});
        console.log(updateInfo);
        res.render('emailVerified');
    } 
    catch (error) {
        console.log(error.message);
    }
}

//Logi user methods started
const loginLoad=async(req,res)=>{
try {
    res.render('login');
} catch (error) {
    console.log(error.message);
}
}

const verifyLogin=async(req,res)=>{
    try {
        const email=req.body.email
        const password=req.body.password;
        //match email
        const userData=await User.findOne({email:email}) ;
        if(userData)
        {
               const passwordMatch=await bcrypt.compare(password,userData.password);
               if(passwordMatch)
               { 
                if(userData.is_verified===0)
                {
                    res.render('login',{message:"Please verify your mail"});

                }else{
                    req.session.user_id=userData._id;
                   res.redirect('/home');
                }
                    
               }else{
                res.render('login',{message:"Email and login are incorrect"});
               }
        }
        else{
             res.render('login',{message:"Email and login are incorrect"});
        }
    } catch (error) {
        console.log(error.message);
    }
}

const loadHome= async(req,res)=>{
    try {
        res.render('home');
    } catch (error) {
        console.log(error.message);
    }
}


const userLogout=async(req,res)=>{
    try {
       req.session.destroy();
       res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
}

//forgot password

const forgotLoad=async(req,res)=>{
    try {
        res.render('forgot');
    } catch (error) {
        console.log(error.message);
    }
}
//For reset password send mail

const sendResetPasswordMail=async(name,email,token)=>{
    try {
      
  
      const transporter=nodemailer.createTransport({
          host:'smtp.gmail.com',
          port:587,
          secure:false,
          requireTLS:true,
          auth:{
              user:config.emailUser,
              pass:config.emailPassword,
          }
      });
      const mailOptions={
          from:config.emailUser,
          to:email,
          subject:'for Reset password mail',
          html:'<p>Hii'+name+',please click here to <a href="http://localhost:3000/forgot-password?token='+token+'">Reset</a>your password. </p>'
      }
      
      transporter.sendMail(mailOptions,function(error,info){
            if(error)
            {
               console.log(error);
            }
            else{
           console.log("Email has been sent :-",info.response);
            }
      })
    } catch (error) {
      console.log(error.message);
    }
  }


  const forgotVerify = async (req, res) => {
    try {
      const email = req.body.email;
      const userData = await User.findOne({ email: email });
  
      if (userData) {
        if (userData.is_verified === 0) {
          res.render('forgot', { message: "Please verify your email" });
        } else {
          const randomstrings = randomstring.generate();
          await User.findOneAndUpdate({ email: email }, { $set: { token: randomstrings } });
          sendResetPasswordMail(userData.name, userData.email, randomstrings);
          res.render('forgot', { message: "Please check your email to reset the password" });
        }
      } else {
        res.render('forgot', { message: "Email is not correct" });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  
  const forgotPasswordLoad=async(req,res)=>{
    try {
        const token=req.query.token;
       const tokenData=await User.findOne({token:token});
       if(tokenData)
       {
        res.render('forgot-password',{user_id:tokenData._id});
       }
       else{
        res.render('404',{message:"Token is invalid"});
       }
    } catch (error) {
        console.log(error.message);
        }
  }

  const resetPassword=async(req,res)=>{
    try {
        const password=req.body.password;
        const user_id=req.body.user_id;
        const secure_password=await securePassword(password);
      const updatedData=  await User.findByIdAndUpdate({_id:user_id},{$set:{password:secure_password ,token:''}});
      res.redirect("/login");
    } catch (error) {
        console.log(error.message);
    }
  }
module.exports= {
    LoadRegister,
    InsertUser,
    verifyMail,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    forgotLoad,
    forgotVerify,
    forgotPasswordLoad,
    resetPassword
    


}