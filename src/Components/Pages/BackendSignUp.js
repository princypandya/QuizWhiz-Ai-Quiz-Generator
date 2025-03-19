const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const SignUpModel=require('./SignUpSchema')

const app=express()

app.use(express.json())
app.use(cors())

mg.connect("mongodb://localhost:27017/UserDetails") 
.then(()=>{
    console.log("MongoDB connected");
})
.catch(()=>{
    console.log("Failed to connect MongoDB");
})

app.post('/Signup', (req, res) => {
    console.log(req.body);
    res.json({ message: 'User registered successfully!' });
});

// app.post('/Signup',(req,res)=>{
//     SignUpModel.create(req,body)
//     .then(UserDetails=>res.join(UserDetails))
//     .catch(err=>res.json(err))
// })

app.listen(5175,()=>{
    console.log("server Running ")
})


