require("dotenv").config()

const mailgun = require("mailgun-js");
const DOMAIN = process.env.DOMAIN;
const mg = mailgun({apiKey:process.env.EMAIL_KEY, domain: DOMAIN});

// send and email for creating an account
const sendWelComeEmail=  (email,name)=>{
    mg.messages().send({
        from:"ankitghosh311@outlook.com",
        to:email,
        subject:"Thanks for joining in!",
        text:`Welcome to the app ${name}. Let us know your experience`
    }).then(data=>console.log("send successful")).catch(err=>console.log(err))
}


// delete email for removing an account
const cancelEmail =(email,name)=>{
       mg.messages().send({
        from:"ankitghosh311@outlook.com",
        to:email,
        subject:"Sorry to see you go",
        text:`goodbye, ${name}, Hope to see you back soon`
    }).then(data=>console.log("remove successful")).catch(err=>console.log(err))
} 

module.exports = {
    sendWelComeEmail,
    cancelEmail
}