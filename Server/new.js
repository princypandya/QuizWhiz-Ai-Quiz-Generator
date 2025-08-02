const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const SignUpModel = require('./models/SignUpSchema');
const Results = require('./models/ResultSchema');
const ResultSchema = require('./models/ResultSchema');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/UserDetails")
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
    res.json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// In your backend route (e.g., routes/results.js)
app.post('/SaveQuizResults', async (req, res) => {
  try {
    const {
      date,
      topic,
      difficulty,
      totalTime,
      timeTaken,
      score,
      totalQuestions,
      email,
      quiz
    } = req.body;

    // Add validation
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const newResult = new Results({
      date: date || new Date(), // Fallback to current date
      topic,
      difficulty,
      timeTaken,
      totalTime,
      score,
      totalQuestions,
      email,
      quiz // This must match your schema
    });

    await newResult.save(); // calculates accuracy

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

app.post('/api/saveNote', async (req, res) => {
  const { email, questionText, note } = req.body;

  console.log('🔍 Incoming data:', { email, questionText, note });

  if (!email || !questionText) {
    console.log('❌ Missing data');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await Results.findOne({ email });

    if (!result) {
      console.log('❌ No result found for email:', email);
      return res.status(404).json({ error: 'Result not found for this email' });
    }

    const question = result.quiz.find(q => q.questionText === questionText);

    if (!question) {
      console.log('❌ Question not found in quiz array');
      return res.status(404).json({ error: 'Question not found' });
    }

    // ✅ Always overwrite note, even if it's empty
    question.note = note;

    await result.save();
    console.log('✅ Note saved successfully');
    res.status(200).json({ message: 'Note saved successfully' });

  } catch (err) {
    console.error('❌ Server error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});



// Fetch all users for email verification
app.get('/getUsers', async (req, res) => {
  try {
    const users = await SignUpModel.find({}, 'email'); // Fetch only emails
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(5175, () => {
  console.log("Server Running on port 5175");
});
