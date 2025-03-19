const mg=require("mongoose");

mg.connect("mongodb://localhost:27017/UserDetails") 
.then(()=>{
    console.log("MongoDB connected");
})
.catch(()=>{
    console.log("Failed to connect MongoDB");
})

const SignUpSchema=new mg.Schema({
    Name:{
        type:String,
        required:true
    },
    BirthDate:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
})

const Collection = new mg.model("SignUpCollection",UserDetails)

module.exports=Collection






