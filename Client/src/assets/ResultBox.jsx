import React from 'react'

function ResultBox(props) {

  const borderColor = props.accuracy >= 80
    ? 'border-green-500'
    : props.accuracy >= 50
      ? 'border-yellow-500'
      : 'border-red-500';

  return (
    <div>
  <div className={`border-2 ${borderColor} rounded-xl m-4 p-4 shadow-md w-full max-w-screen-lg mx-auto`}>
    
    {/* Top Row: Quiz Details (5 columns) */}
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

    {/* Bottom Row: Questions */}
    <div className="w-full mt-6">
      <div className="text-xl mb-2 font-semibold">Questions</div>
      <div className="text-gray-700 text-sm space-y-2 m-4">
        {props.quiz && props.quiz.length > 0 ? (
          props.quiz.map((q, idx) => (
            <div key={idx}>
              <div className=" text-md text-blue-500">Q{idx + 1}: {q.questionText}</div>
              <div className="ml-4">
                {Array.isArray(q.options) ? (
                  <div>
                    {q.options.map((opt, i) => (
                      <div key={i} className='text-md border-2 gray rounded-xl m-3 p-4 shadow-md'>{opt}</div>
                    ))}
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
    </div>

  </div>
</div>


  );
}

export default ResultBox
