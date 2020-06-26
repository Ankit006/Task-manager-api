const express = require("express");
const Task = require("../models/task");
const router = express.Router()
const auth = require("../middleware/auth");
//////////////// CRUD operation for task data ///////////////

//create new task
router.post("/tasks",auth,async (req,res)=>{
    const task = new Task({
        owner:req.user._id,
        ...req.body
    });
    try{
        await task.save()
         res.status(201).send(task)
    }catch(err){
        res.status(400).send(err)
    } 
})

// get all task data

router.get("/tasks",auth,async (req,res)=>{
    // get completed task
    let complete;
    if(req.query.completed){
        complete = {owner:req.user._id,completed:req.query.completed};
    }else{
        complete = {owner:req.user._id};
    }
    // get the sorted task
    let sort = {};
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = parts[1] === "desc"?-1:1;
    }
    
    try{
        const task = await Task.find(complete,null,{limit:parseInt(req.query.limit),skip:parseInt(req.query.skip),sort}); 
        res.status(200).send(task)
    }catch(err){
        res.status(500).send(err)
    }
})

// get task by id
router.get("/tasks/:id",auth,async (req,res)=>{
    const _id = req.params.id;
    try{
        const task = await Task.findOne({_id,owner:req.user.id});
        if(!task) return res.status(404).send()
        res.status(200).send(task)
    }catch(err){
        res.status(404).send(err)
    }
})

//update task data
router.patch("/tasks/:id",auth,async (req,res)=>{
     
    // validate user input//
     const updates = Object.keys(req.body)
     const allowUpdates = ["description","completed"];
     const isValid = updates.every(data=>allowUpdates.includes(data));
     if(!isValid) return res.status(404).send()
     //------------------------//
    
     const _id = req.params.id;
    try{
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
        if(!task) return res.status("404").send()

        updates.forEach(update=>task[update] = req.body[update]);
        await task.save()
        res.send(task)
    }catch(err){
        res.status(400).send(err)
    
    }
})

//delete task data
router.delete("/tasks/:id",auth,async (req,res)=>{
    try{
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task) return res.status(404).send()
        res.status(200).send(task)
    }catch(err){
        res.status(404).send()
    }
})
///////////////////////////////////////////////////////////////

module.exports = router;