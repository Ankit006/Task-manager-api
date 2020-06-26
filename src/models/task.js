const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
     owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    description:{
        type:String,
        trim:true,
        required:true
    },
    completed:{
        type:Boolean,
        default:false,
        ref:"User" // reference to other model
    }
},{
    timestamps:true
})

 // create new task data
 const Tasks = mongoose.model("Tasks",taskSchema)


module.exports = Tasks;