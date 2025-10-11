<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
  <h1>QuizWhiz</h1>
  <p>
    QuizWhiz is a dynamic quiz platform built with the MERN stack (MongoDB, Express.js, React, Node.js) leveraging the Gemini API to generate quiz questions on any topic. The platform allows customizable quizzes, user authentication, performance insights via graphs, and note-taking for enhanced learning.
  </p>

  <h2>Project Structure</h2>
  <ul>
    <li><strong>client/</strong> — Contains the React frontend application.</li>
    <li><strong>server/</strong> — Contains the Node.js/Express backend API.</li>
  </ul>

  <h2>Features</h2>
  <ul>
    <li>Customizable quizzes by topic, number of questions, difficulty, and timer settings.</li>
    <li>User authentication with signup and login functionality.</li>
    <li>Performance visualization with detailed graphs.</li>
    <li>Notes feature to add personal comments on questions.</li>
  </ul>

  <h2>Getting Started</h2>

  <h3>Prerequisites</h3>
  <ul>
    <li>Node.js (version 18 or later recommended)</li>
    <li>npm (comes with Node.js)</li>
    <li>MongoDB instance (local or remote)</li>
    <li>Gemini API key</li>
  </ul>

  <h3>Installation &amp; Setup</h3>
  <ol>
    <li>Clone the repository:
      <pre><code>git clone &lt;repository_url&gt;
cd QuizWhiz
      </code></pre>
    </li>
    <li>Install backend dependencies and start the server:
      <pre><code>cd server
npm install
npm start
      </code></pre>
    </li>
    <li>Install frontend dependencies and start the client:
      <pre><code>cd ../client
npm install
npm run dev
      </code></pre>
    </li>
  </ol>

  <h3>Important Notes on Client</h3>
  <ul>
    <li>The client application uses React.</li>
    <li>The main JavaScript file controlling the quiz interface is <code>chat.js</code>.</li>
    <li><code>npm run dev</code> runs the React development server with hot reload for a smooth development experience.</li>
  </ul>

  <h2>Environment Variables</h2>
  <p>Create <code>.env</code> files in both client and server folders with the following variables:</p>
  

  <h2>Usage</h2>
  <ul>
    <li>Register or login to start using QuizWhiz.</li>
    <li>Create quizzes with your preferred options.</li>
    <li>Complete quizzes and analyze your performance with graphs.</li>
    <li>Add notes on each question to aid learning and review.</li>
  </ul>

  <h2>Demo Video</h2>
  <p>
    Watch the demo of QuizWhiz in action here: 
    <a href="https://drive.google.com/file/d/1OR74BROmSi65d0xu6AeQA5e6i5lLhlq-/view?usp=sharing" target="_blank" rel="noopener noreferrer">
      QuizWhiz Demo Video
    </a>
  </p>

  <h2>Contributing</h2>
  <p>
    Contributions are welcome! Please fork the repo and open pull requests for improvements or bug fixes, following the existing code style.
  </p>

  <h2>License</h2>
  <p>MIT License.</p>

  <p>
    Explore QuizWhiz for a fun and informative quiz experience tailored to your learning goals!
  </p>
</body>
</html>
