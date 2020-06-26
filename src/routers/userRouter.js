const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const Task = require("../models/task");
const {sendWelComeEmail,cancelEmail} = require("../email/account");
////////// CRUD operation for user data ////////////

//create user
router.post("/users", async (req,res)=>{
    const user =  new User(req.body);
    const token = await user.generateAuthToken() // generate auth token 
    try{
        await user.save();
        sendWelComeEmail(user.email,user.name);
        res.status(201).send({user,token})
    }catch(err){
        res.status(400).send(err)
    }
    
})
//sign in 
router.post("/users/login",async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password) // custom method(check modules directory)
       const token = await user.generateAuthToken()

        res.send({user,token})
    }catch(err){
        res.status(400).send(err)
    }
})

//logout user
router.post("/users/logout",auth,async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token;
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

//logout user from all devices
router.post("/users/logout/all",auth,async (req,res)=>{
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send();
    }catch(err){
        res.status(500).send()
    }
})

// get login user data
router.get("/users/me",auth,async (req,res)=>{
       res.send(req.user) 

})



// update user data

router.patch("/users/update/me",auth,async(req,res)=>{
    
    // validate user input//
    const updates = Object.keys(req.body);
    const allowUpdate = ["name","age","email","password"];
    const isValid = updates.every(data=>allowUpdate.includes(data))
    if(!isValid)  return res.status(404).send()
    //------------------------//

    try{
        const user =  req.user;
        updates.forEach(update=>  user[update] = req.body[update])
        await user.save()
        res.send(user)

    }catch(err){
        res.status(400).send(err)
    }
})


// delete user data
router.delete("/users/me", auth,async (req,res)=>{
    try{
        Task.deleteMany({owner:req.user.id})
        await req.user.remove()
        cancelEmail(req.user.email,req.user.name)
        res.status(200).send(req.user)
    }catch(err){
        res.status(404).send();
    }
})

//upload profile image
const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error("Please provide correct format"))
        }
        cb(undefined,true)
    }
})
// view the profile image
router.post("/users/me/avatar",auth,upload.single("upload"),async (req,res)=>{
    const buffer =  await sharp(req.file.buffer).resize({
        width:250,
        height:250
    }).png().toBuffer();
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

// delete profile pic data from database
router.delete("/users/me/avatar",auth, async (req,res)=>{
    try{
     req.user.avatar = undefined;  
     await req.user.save();
     res.send() 
    }catch(err){
         res.status(404).send();
    }
})

// show profile pic from browser
router.get("/users/:id/avatar",async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(!user ||!user.avatar )  throw new Error();
        res.set("Content-Type","image/png")
        res.send(user.avatar)
    }catch(err){
        res.status(404).send()
    }
})
////////////////////////////////////////////////////////////////

 module.exports = router;