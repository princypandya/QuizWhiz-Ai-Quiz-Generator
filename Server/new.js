const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const SignUpModel = require('./models/SignUpSchema');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/UserDetails")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch(() => {
        console.log("Failed to connect MongoDB");
    });

// Signup Route
app.post('/Signup', (req, res) => {
    SignUpModel.create(req.body)
        .then(userDetails => res.json({ message: "User registered successfully!", userDetails }))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Login Route with JWT
app.post('/Login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await SignUpModel.findOne({ email: email, password: password });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        res.json({ message: "Login successful"});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.listen(5175, () => {
    console.log("Server Running on port 5175");
});
