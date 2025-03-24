const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const SignUpModel = require('./models/SignUpSchema');
const Results = require('./models/ResultSchema');

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

// In your backend route (e.g., routes/results.js)
app.post('/SaveQuizResults', async (req, res) => {
    try {
      const { date, topic, difficulty, timeTaken, score, totalQuestions, email } = req.body;
      
      // Add validation
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
  
      const newResult = new Results({
        date: date || new Date(), // Fallback to current date
        topic,
        difficulty,
        timeTaken,
        score,
        totalQuestions,
        email // This must match your schema
      });
  
      await newResult.save();
      res.status(201).json({ message: 'Results saved successfully' });
    } catch (error) {
      console.error("Backend error:", error);
      res.status(500).json({ 
        message: 'Error saving results',
        error: error.message,
        fullError: error // For debugging
      });
    }
  });


  app.get('/GetUserResults/:email', async (req, res) => {
      try {
        const userEmail = req.params.email;
        const userResults = await Results.find({ email: userEmail }).sort({ date: -1 }); // Newest first
        res.json(userResults);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

app.listen(5175, () => {
    console.log("Server Running on port 5175");
});
