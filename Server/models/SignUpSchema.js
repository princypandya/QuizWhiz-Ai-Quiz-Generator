const mongoose=require('mongoose')

const SignUpSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const SignUpModel = new mongoose.model("UserDetails", SignUpSchema)
module.exports=SignUpModel