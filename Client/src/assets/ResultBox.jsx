import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

function ResultBox(props) {
  const [showMore, setShowMore] = useState(false);

  // Manage editing state and input for each question's note
  const [editingNotes, setEditingNotes] = useState({});
  const [noteInputs, setNoteInputs] = useState({});

  const borderColor =
    props.accuracy >= 80
      ? 'border-green-500'
      : props.accuracy >= 50
        ? 'border-yellow-500'
        : 'border-red-500';

  return (
    <div>
      <div className={`border-2 ${borderColor} rounded-xl m-5 p-4 shadow-md`}>
        {/* Top Row: Quiz Details */}
        <div className="flex flex-wrap justify-between gap-4">
          <div className="flex flex-col min-w-[150px] flex-1 sm:max-w-[200px]">
            <span className="text-sm text-gray-500">Date</span>
            <span className="font-semibold break-words">{props.date}</span>
          </div>

          <div className="flex flex-col min-w-[150px] flex-1 sm:max-w-[200px]">
            <span className="text-sm text-gray-500">Topic</span>
            <span className="font-semibold break-words">{props.topic}</span>
          </div>

          <div className="flex flex-col min-w-[150px] flex-1 sm:max-w-[200px]">
            <span className="text-sm text-gray-500">Difficulty</span>
            <span className="font-semibold break-words">{props.difficulty}</span>
          </div>

          <div className="flex flex-col min-w-[150px] flex-1 sm:max-w-[200px]">
            <span className="text-sm text-gray-500">Time Taken</span>
            <span className="font-semibold break-words">{props.timeTaken}</span>
          </div>

          <div className="flex flex-col min-w-[150px] flex-1 sm:max-w-[200px]">
            <span className="text-sm text-gray-500">Score</span>
            <span className="font-semibold break-words">
              {props.score} / {props.total} ({props.accuracy.toFixed(0)}%)
            </span>
          </div>
        </div>

        {/* Button placed inside, aligned right */}
        <div className="w-full flex justify-end mt-4">
          <button
            className="bg-purple-400 text-white text-sm px-2 py-1 rounded hover:bg-purple-600 transition"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? 'Show Less' : 'Show More'}
          </button>
        </div>
      </div>

      {/* Bottom Row: Questions */}
      <AnimatePresence initial={false}>
        {showMore && (
          <motion.div
            key="dropdown"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="overflow-hidden mt-6 m-5 p-4"
          >
            <div className="text-[25px] mb-5 font-semibold text-purple-600">Questions</div>

            <div className="text-sm space-y-6">
              {props.quiz && props.quiz.length > 0 ? (
                props.quiz.map((q, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-white to-purple-50 p-4   sm:p-6 md:p-7 rounded-2xl shadow-md border border-purple-100 mx-4 sm:mx-6 transition-all duration-300"
                  >
                    {/* Question Text */}
                    <div className="text-[16px] sm:text-[17px] md:text-lg font-semibold mb-4 text-gray-900 leading-snug">
                      <span className="text-purple-600">Q{idx + 1}:</span> {q.questionText}
                    </div>

                    {/* Options */}
                    <div className="ml-2 space-y-2">
                      {Array.isArray(q.options) ? (
                        q.options.map((opt, i) => {
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
                              className={`rounded-xl p-3 shadow-sm transition-all duration-300 text-sm sm:text-base ${optionStyle}`}
                            >
                              {opt}
                            </div>
                          );
                        })
                      ) : (
                        <div>{q.options}</div>
                      )}

                      {/* Note Section */}
                      <div className="w-full mt-3">
                        {editingNotes[idx] ? (
                          <>
                            <textarea
                              className="w-full p-3 border border-yellow-300 rounded-xl text-sm bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                              rows={3}
                              value={noteInputs[idx] || ''}
                              onChange={(e) =>
                                setNoteInputs((prev) => ({
                                  ...prev,
                                  [idx]: e.target.value,
                                }))
                              }
                              placeholder="Write your note here..."
                            />
                            <div className="flex justify-end mt-2">
                              <button
                                className="bg-emerald-500 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-emerald-600 transition"
                                onClick={async () => {
                                  props.quiz[idx].note = noteInputs[idx];
                                  setEditingNotes((prev) => ({ ...prev, [idx]: false }));

                                  try {
                                    await axios.post('http://localhost:5175/api/saveNote', {
                                      email: props.email,
                                      questionText: q.questionText,
                                      note: noteInputs[idx],
                                    });
                                  } catch (error) {
                                    console.error('Error saving note:', error);
                                    console.log("📧 Email being sent:", props.email);
                                  }
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
                                onClick={ async () => {
                                  setNoteInputs((prev) => ({
                                    ...prev,
                                    [idx]: q.note || '',
                                  }));
                                  setEditingNotes((prev) => ({ ...prev, [idx]: true }));

                                  try {
                                    await axios.post('http://localhost:5175/api/saveNote', {
                                      email: props.email,
                                      questionText: q.questionText,
                                      note: noteInputs[idx],
                                    });
                                  } catch (error) {
                                    console.error('Error saving note:', error);
                                    console.log("📧 Email being sent:", props.email);
                                  }
                                }}
                              >
                                {String(q.note || '').trim() ? 'Change Note' : 'Add Note'}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400">No questions available</div>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ResultBox;
