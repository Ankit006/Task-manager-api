require("./db/mongoose"); // for connect to database

// require packages
const express = require("express");

//routers
const userRouter = require("./routers/userRouter");
const taskRouter = require("./routers/taskRouter");
const auth = require("./middleware/auth");
// important variables
const app = express();
const port = process.env.PORT || 3000;


// middleware
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


//start the server
app.listen(port,()=>{
    console.log(`server is up on ${port}`)
})


