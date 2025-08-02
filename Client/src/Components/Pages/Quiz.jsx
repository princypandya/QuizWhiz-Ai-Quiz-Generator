import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

function Quiz() {
  const [config, setConfig] = useState({
    topic: "",
    difficulty: "easy",
    numQuestions: 5,
    timerType: "individual",
    timerDuration: 10,
  });

  const [showConfigModal, setShowConfigModal] = useState(true);
  const [userAnswers, setUserAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(config.timerDuration);
  const [totalTime, setTotalTime] = useState(config.timerDuration * config.numQuestions);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [actualTimeTaken, setActualTimeTaken] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [editingNotes, setEditingNotes] = useState({});
  const [noteInputs, setNoteInputs] = useState({});


  // Load saved configuration on component mount
  useEffect(() => {
    const savedTopic = localStorage.getItem("selectedTopic");
    const savedDifficulty = localStorage.getItem("selectedDifficulty");
    const savedNumQuestions = localStorage.getItem("numQuestions");

    if (savedTopic || savedDifficulty || savedNumQuestions) {
      setConfig(prevConfig => ({
        ...prevConfig,
        ...(savedTopic && { topic: savedTopic }),
        ...(savedDifficulty && { difficulty: savedDifficulty }),
        ...(savedNumQuestions && { numQuestions: parseInt(savedNumQuestions) })
      }));
    }
  }, []);

  // AI Question Generation
  const handleCompletion = async () => {
    setError(null);

    try {
      const apiKey = "AIzaSyDDErYKdk9hSMboF-ICX5IzEijkmz9nUyY";
      if (!apiKey) throw new Error("API Key is missing");

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate ${config.numQuestions} new multiple-choice questions (MCQs) with difficulty level "${config.difficulty}" on the topic "${config.topic}". Return JSON only in the format:
                  [
                    {
                      "id": 1,
                      "text": "Question text?",
                      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
                      "correctAnswer": "Option X"
                    },
                    ...
                  ]`,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Remove any unexpected formatting
      rawText = rawText.replace(/```json|```/g, "").trim();

      let aiQuestions = [];
      try {
        aiQuestions = JSON.parse(rawText);
      } catch (error) {
        console.error("Error parsing AI response:", error);
        throw new Error("Invalid AI-generated question format");
      }

      if (!Array.isArray(aiQuestions) || aiQuestions.length === 0) {
        throw new Error("Empty or invalid AI-generated questions");
      }

      // Store questions in state and localStorage
      setQuestions(aiQuestions);
      localStorage.setItem("quizQuestions", JSON.stringify(aiQuestions));

      return aiQuestions;

    } catch (err) {
      console.error("Error in handleCompletion:", err.message);
      setError(err.message);
      return null;
    }
  };

  // Configuration Submit Handler
  const handleConfigSubmit = async () => {
    let parsedQuestions = [];
    const storedQuestions = localStorage.getItem("quizQuestions");

    try {
      // First try to get AI-generated questions
      const aiQuestions = await handleCompletion();

      if (aiQuestions && aiQuestions.length > 0) {
        parsedQuestions = aiQuestions;
        console.log("Generated from AI");
      } else if (storedQuestions) {
        // Fallback to stored questions
        parsedQuestions = JSON.parse(storedQuestions);
        console.log("Using stored questions");
      } else {
        // Fallback to mock questions
        console.log("Using mock questions");
        parsedQuestions = Array.from({ length: config.numQuestions }, (_, i) => ({
          id: i + 1,
          text: `Question ${i + 1}: What is the answer?`,
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          correctAnswer: "Option 1",
        }));
      }
    } catch (error) {
      console.error("Error parsing questions:", error);
      parsedQuestions = [];
    }

    setQuestions(parsedQuestions);
    setShowConfigModal(false);
    setQuizStarted(true);
    setTimer(config.timerDuration);
    setTotalTime(config.timerType === "individual" ? config.timerDuration * config.numQuestions : config.timerDuration * 60);
    setStartTime(new Date());
  };

  // Answer Selection Handler
  const handleAnswerSelect = (answer) => {
    setSelectedOption(answer);

    const currentQuestion = questions[currentQuestionIndex];
    const answerDetails = {
      questionText: currentQuestion.text,
      options: currentQuestion.options,
      correctAnswer: currentQuestion.correctAnswer,
      userAnswer: answer,
      isCorrect: answer === currentQuestion.correctAnswer
    }

    const updatedAnswers = [...userAnswers, answerDetails];
    setUserAnswers(updatedAnswers);


    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        if (config.timerType === "individual") {
          setTimer(config.timerDuration);
        }
        setSelectedOption(null);
      } else {
        finishQuiz(updatedAnswers);
      }
    }, 1500);
  };

  // Timer Effects
  useEffect(() => {
    if (quizStarted && !quizFinished) {
      const interval = setInterval(() => {
        if (config.timerType === "individual") {
          setTimer((prev) => prev - 1);
        } else {
          setTotalTime((prev) => prev - 1);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [quizStarted, quizFinished, config.timerType]);

  useEffect(() => {
    if (quizStarted && !quizFinished) {
      if (config.timerType === "individual" && timer === 0) {
        handleTimeUp();
      } else if (config.timerType === "collective" && totalTime === 0) {
        const currentQuestion = questions[currentQuestionIndex];
        const skippedAnswer = {
          questionText: currentQuestion.text,
          options: currentQuestion.options,
          correctAnswer: currentQuestion.correctAnswer,
          userAnswer: null,
          isCorrect: false,
        };

        const updatedAnswers = [...userAnswers, skippedAnswer];
        setUserAnswers(updatedAnswers);
        finishQuiz(updatedAnswers);
      }
    }
  }, [timer, totalTime, quizStarted, quizFinished, config.timerType]);

  // Time Up Handler
  const handleTimeUp = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(config.timerDuration);
    } else {
      const currentQuestion = questions[currentQuestionIndex];
      const skippedAnswer = {
        questionText: currentQuestion.text,
        options: currentQuestion.options,
        correctAnswer: currentQuestion.correctAnswer,
        userAnswer: null,
        isCorrect: false,
      };

      const updatedAnswers = [...userAnswers, skippedAnswer];
      setUserAnswers(updatedAnswers);
      finishQuiz(updatedAnswers);
    }
  };

  // Finish Quiz and Save Results
  const finishQuiz = (answers) => {
    const endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000;
    setActualTimeTaken(timeTaken);
    setQuizFinished(true);
    setQuizStarted(false);

    const userEmail = localStorage.getItem('token');

    if (!userEmail) {
      console.error("No user email found in localStorage");
      return;
    }

    const score = answers.filter((answer) => answer.isCorrect).length;
    setFinalScore(score);

    const results = {
      date: new Date().toISOString(),
      topic: config.topic,
      difficulty: config.difficulty,
      totalTime: totalTime,
      timeTaken: timeTaken,
      score: score,
      totalQuestions: questions.length,
      email: userEmail,
      quiz: answers
    };

    axios.post('http://localhost:5175/SaveQuizResults', results)
      .then(response => {
        console.log("Results saved successfully:", response.data);
      })
      .catch(error => {
        console.error("Error saving results:", error.response?.data || error.message);
      });
  };

  // Time Formatting
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Render
  return (
    <div style={styles.pageWrapper}>
      {/* Configuration Modal */}
      {showConfigModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Quiz Configuration</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <label style={styles.label}>
              Topic:
              <input
                type="text"
                value={config.topic}
                onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                style={styles.input}
              />
            </label>
            <label style={styles.label}>
              Difficulty:
              <select
                value={config.difficulty}
                onChange={(e) => setConfig({ ...config, difficulty: e.target.value })}
                style={styles.input}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>

            <label style={styles.label}>
              Number of Questions:
              <input
                type="number"
                value={config.numQuestions}
                onChange={(e) => setConfig({ ...config, numQuestions: e.target.value })}
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              Timer Type:
              <select
                value={config.timerType}
                onChange={(e) => setConfig({ ...config, timerType: e.target.value })}
                style={styles.input}
              >
                <option value="individual">Individual</option>
                <option value="collective">Collective</option>
              </select>
            </label>
            <label style={styles.label}>
              Timer Duration ({config.timerType === "individual" ? "seconds" : "minutes"}):
              <input
                type="number"
                value={config.timerDuration}
                onChange={(e) =>
                  setConfig({ ...config, timerDuration: parseInt(e.target.value) })
                }
                style={styles.input}
              />
            </label>
            <button onClick={handleConfigSubmit} style={styles.button}>
              Start Quiz
            </button>
          </div>
        </div>
      )}

      {/* Quiz Questions */}
      {quizStarted && !quizFinished && (
        <div style={styles.quizFullPage}>
          <h2 style={styles.questionTitle}>Question {currentQuestionIndex + 1}</h2>
          <p style={styles.questionText}>{questions[currentQuestionIndex]?.text}</p>
          <div style={styles.optionsContainer}>
            {questions[currentQuestionIndex]?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                style={{
                  ...styles.optionButton,
                  ...(selectedOption === option ? styles.glow : {}),
                }}
              >
                {option}
              </button>
            ))}
          </div>
          {config.timerType === "individual" ? (
            <p style={styles.timer}>Time Remaining: {timer} seconds</p>
          ) : (
            <p style={styles.timer}>Total Time Remaining: {formatTime(totalTime)}</p>
          )}
        </div>
      )}

      {quizFinished && (
        <div
          style={{
            ...styles.quizFullPage,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: '40px',
            marginTop: '40px',
            padding: '20px',
          }}
        >
          {/* Circular Score Indicator */}
          <svg
            height="120"
            width="120"
            style={{
              flexShrink: 0,
              maxWidth: '100%',
            }}
          >
            <circle
              stroke={
                finalScore / questions.length < 0.3
                  ? '#ef4444'
                  : finalScore / questions.length <= 0.6
                    ? '#facc15'
                    : '#22c55e'
              }
              fill="transparent"
              strokeWidth="15"
              r="50"
              cx="60"
              cy="60"
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dy=".3em"
              fontSize="16"
              fill="#111827"
              fontWeight="bold"
            >
              {finalScore} / {questions.length}
            </text>
          </svg>

          {/* Message Box */}
          <div
            style={{
              maxWidth: '300px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <h2 style={{ ...styles.resultTitle, fontSize: '1.5rem', marginBottom: '1rem' }}>
              Quiz Finished!
            </h2>
            <p
              style={{
                fontSize: '1rem',
                color: '#1f3b6cff',
                lineHeight: '1.5',
              }}
            >
              {(finalScore / questions.length < 0.3) &&
                'You need improvement. Keep practicing!'}
              {(finalScore / questions.length >= 0.3 &&
                finalScore / questions.length < 0.6) &&
                "Good job! You're getting there."}
              {(finalScore / questions.length >= 0.6) &&
                'Excellent! You did really well!'}
            </p>
          </div>
          <div className="w-full mt-8 px-4">

            <AnimatePresence initial={false}>
              {(
                <motion.div
                  key="dropdown"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="text-[22px] mb-5 font-semibold text-blue-500">Quiz Overview</div>
                  <div className="space-y-6">
                    {userAnswers.map((q, idx) => (
                      <div
                        key={idx}
                        className="bg-gradient-to-br from-white to-purple-50 p-4 sm:p-6 md:p-7 rounded-2xl shadow-md border border-purple-100 mb-6 transition-all duration-300"
                      >
                        {/* Question */}
                        <div className="text-[16px] sm:text-[17px] md:text-lg font-semibold mb-4 text-gray-900 leading-snug">
                          <span className="text-purple-600">Q{idx + 1}:</span> {q.questionText}
                        </div>

                        {/* Options */}
                        <div className="ml-2 space-y-3">
                          {q.options.map((opt, i) => {
                            let optionStyle =
                              'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100';

                            if (opt === q.correctAnswer && opt === q.userAnswer) {
                              optionStyle =
                                'bg-emerald-100 text-emerald-800 font-semibold border border-emerald-400';
                            } else if (opt === q.correctAnswer) {
                              optionStyle =
                                'bg-teal-50 text-teal-700 border border-teal-300';
                            } else if (opt === q.userAnswer) {
                              optionStyle =
                                'bg-rose-50 text-rose-600 border border-rose-300';
                            }

                            return (
                              <div
                                key={i}
                                className={`px-4 py-2 rounded-xl transition-all duration-300 text-sm sm:text-base ${optionStyle}`}
                              >
                                {opt}
                              </div>
                            );
                          })}
                        </div>

                        {/* Note Section */}
                        {/* <div className="mt-6">
                          {editingNotes[idx] ? (
                            <>
                              <textarea
                                className="w-full p-3 border border-yellow-300 rounded-xl text-sm bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                                rows={3}
                                value={noteInputs[idx] || ''}
                                onChange={(e) =>
                                  setNoteInputs((prev) => ({ ...prev, [idx]: e.target.value }))
                                }
                                placeholder="Write your note here..."
                              />
                              <div className="flex justify-end mt-2">
                                <button
                                  className="bg-emerald-500 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-emerald-600 transition"
                                  onClick={() => {
                                    userAnswers[idx].note = noteInputs[idx];
                                    setEditingNotes((prev) => ({ ...prev, [idx]: false }));
                                  }}
                                >
                                  Done
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              {String(q.note || '').trim() && (
                                <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-3 text-sm text-yellow-800 shadow-sm whitespace-pre-wrap">
                                  {q.note}
                                </div>
                              )}
                              <div className="flex justify-end mt-2">
                                <button
                                  className="bg-purple-500 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-purple-600 transition"
                                  onClick={() => {
                                    setNoteInputs((prev) => ({ ...prev, [idx]: q.note || '' }));
                                    setEditingNotes((prev) => ({ ...prev, [idx]: true }));
                                  }}
                                >
                                  {String(q.note || '').trim() ? 'Change Note' : 'Add Note'}
                                </button>
                              </div>
                            </>
                          )}
                        </div> */}
                      </div>
                    ))}

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

    </div>
  );
}

const styles = {
  pageWrapper: {
    width: "100%",
    maxWidth: "100%", // or "1200px"
    margin: "0 auto",
    padding: "1rem",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100vh",
    width: "100vw",
    backdropFilter: "blur(6px)",
    backgroundColor: "#eff6ff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modal: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
    maxWidth: "400px",
    width: "90%",
    textAlign: "center",
  },
  modalTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#2d3748",
  },
  label: {
    display: "block",
    margin: "10px 0",
    fontSize: "16px",
    color: "#4a5568",
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "5px",
    borderRadius: "5px",
    border: "1px solid #e2e8f0",
    fontSize: "16px",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#4299e1",
    color: "#ffffff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  quizFullPage: {
    width: "100%",
    textAlign: "left",
  },
  questionTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#2d3748",
  },
  questionText: {
    fontSize: "20px",
    marginBottom: "20px",
    color: "#4a5568",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  optionButton: {
    padding: "12px 24px",
    backgroundColor: "#edf2f7",
    border: "1px solid #e2e8f0",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    textAlign: "left",
  },
  glow: {
    animation: "glow 1.5s infinite",
    borderColor: "#4299e1",
  },
  timer: {
    marginTop: "20px",
    fontSize: "16px",
    color: "#e53e3e",
  },
  resultTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#2d3748",
  },
  resultText: {
    fontSize: "20px",
    color: "#4a5568",
  },
};

export default Quiz;