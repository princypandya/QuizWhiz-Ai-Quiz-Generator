import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


function ResultBox(props) {

  const [showMore, setShowMore] = useState(false); // toggle state

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
            className="bg-blue-400 text-white text-sm px-2 py-1 rounded hover:bg-blue-600 transition"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? 'Show Less' : 'Show More'}
          </button>
        </div>
      </div>

      {/* Bottom Row: Questions */}
      {/* AnimatePresence wrapper */}
      <AnimatePresence initial={false}>
      {showMore && (
        <motion.div
          key="dropdown"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="overflow-hidden w-full mt-6 m-5 p-4"
        >
          <div className="text-xl mb-2 font-semibold text-blue-500">Questions</div>
          <div className="text-sm space-y-4 m-2">
            {props.quiz && props.quiz.length > 0 ? (
              props.quiz.map((q, idx) => (
                <div key={idx} className='mr-6 ml-6' >
                  <div className="text-[16px] font-medium mb-6">
                    Q{idx + 1}: {q.questionText}
                  </div>
                  <div className="ml-4">
                    {Array.isArray(q.options) ? (
                      <div className="gap-2 mb-10">
                        {q.options.map((opt, i) => {
                          let optionStyle = 'bg-gray-50 border-gray-400 text-gray-00 mb-2';

                          if (opt === q.correctAnswer && opt === q.userAnswer) {
                            optionStyle = 'bg-green-100 text-green-600 font-semibold mb-2';
                          } else if (opt === q.correctAnswer) {
                            optionStyle = 'bg-green-50 text-green-600 font-medium mb-2';
                          } else if (opt === q.userAnswer) {
                            optionStyle = 'bg-red-50 text-red-600 font-medium mb-2';
                          }

                          return (
                            <div
                              key={i}
                              className={`rounded-lg p-3 shadow-sm transition-all duration-300 ${optionStyle}`}
                            >
                              {opt}
                            </div>
                          );
                        })}

                      </div>
                    ) : (
                      <div>{q.options}</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400">No questions available</div>
            )}
          </div>
        </motion.div>)}
        </AnimatePresence>
    </div>
  );
}

export default ResultBox;
