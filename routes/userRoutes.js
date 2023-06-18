const express=require("express");
const routes=express();
const session=require("express-session");
const config=require("../config/config");
routes.use(session({secret:config.sessionsecret,resave: true, saveUninitialized: true}));
const auth=require("../middleware/auth");

routes.set('view engine','ejs');
routes.set('views','./views/users');
const bodyParser=require("body-parser");
routes.use(bodyParser.json());
routes.use(bodyParser.urlencoded({extended:true}));
const multer=require("multer");
const path=require("path");
const storage=multer.diskStorage({
    destination:function(req,file,cb)
    {
         cb(null,path.join(__dirname,'../public/userImage'));
    },
    filename:function(req,file,cb)

    {
         const name=Date.now()+'-'+file.originalname; 
         cb(null,name);
    }
});
const upload=multer({storage:storage});
const user=require('../controllers/userController');
routes.get("/registeration",auth.isLogout,user.LoadRegister);
routes.post("/registeration",upload.single('image'),user.InsertUser);
routes.get("/verify",user.verifyMail);
routes.get("/",auth.isLogout,user.loginLoad);
routes.get("/login",auth.isLogout,user.loginLoad);
routes.post("/login",user.verifyLogin);
routes.get("/home",auth.isLogin,user.loadHome);
routes.get("/logout",auth.isLogin,user.userLogout);
routes.get("/forgot",auth.isLogout,user.forgotLoad);
routes.post("/forgot",user.forgotVerify);
routes.get("/forgot-password",auth.isLogout,user.forgotPasswordLoad);
routes.post("/forgot-password",user.resetPassword);


module.exports=routes;