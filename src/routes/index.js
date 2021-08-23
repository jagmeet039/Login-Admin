const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user")
const adminEmail = 'admin@gmail.com' 

router.get("/", (req,res)=>{
    if(req.session.user)  {
        const user = req.session.user;
        if(user.email == adminEmail) return res.redirect("admin")
        return res.redirect("home")
    }
    res.render("signin", {err:""})
})

router.post("/", async (req,res)=>{
    const{email, password} = req.body;
    const user = await User.findOne({email:email});
    // console.log(user)
    if(user===null|| user===undefined){
        res.render("signin", {err:"Provide a valid email"})
    }else{

        // Check If Admin
        if(user.email == adminEmail){
            if(!bcrypt.compareSync(password, user.password)){
                return res.render("signin", {err:"Incorrect Password"})
            }
            req.session.user = user; 
            res.redirect("admin")
        }
        // User
        else{
            if(!bcrypt.compareSync(password, user.password)){
                return res.render("signin", {err:"Incorrect Password"})
            }
            req.session.user = user; 
            res.redirect("home")

        }



        
    }
})

router.get("/signup", (req,res)=>{
    if(req.session.user){
        const user = req.session.user;
        if(user.email == adminEmail) return res.redirect("admin")
        return res.redirect("home")
    }
    res.render("signup", {err:""})
})
router.post("/signup", async(req,res)=>{
    const{email, password, name} = req.body;

    const user = await User.findOne({email:email});
    if(user){
        res.render("signup", {err:"Email already present!"})
        return 
    }

    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = new User({email, password: hashedPassword, name})
    await newUser.save();
    res.redirect("/")
})

router.get("/home", async(req, res)=>{
    const user = req.session.user;
    if(user==undefined) res.redirect("/")
    else if(user.email == adminEmail){
        return res.redirect("admin")
    }
    res.render("home", {name:user.name})
})
router.get("/signout", (req,res)=>{
    req.session.destroy(err => {
        res.clearCookie('my-session')
        res.redirect("/")
    })
})

router.get("/admin", (req,res)=>{
    if(req.session.user){
        const user = req.session.user;
        if(user.email != adminEmail) return res.redirect("home")
        return res.redirect("admin")
    }
    res.render("admin")
})



module.exports = router