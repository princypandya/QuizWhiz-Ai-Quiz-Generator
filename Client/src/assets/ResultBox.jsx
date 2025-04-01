import React from 'react'

function ResultBox(props) {

  const borderColor = props.accuracy >= 80
    ? 'border-green-500'
    : props.accuracy >= 50
      ? 'border-yellow-500'
      : 'border-red-500';

  return (
    <div>
      <div className={`border-2 ${borderColor} rounded-xl m-4 p-4 shadow-md w-full max-w-screen-lg mx-auto flex justify-between`}>

        <div className="flex flex-col w-[200px] text-left">
          <span className="text-sm text-gray-500">Date</span>
          <span className="font-semibold break-words">{props.date}</span>
        </div>

        <div className="flex flex-col w-[200px] text-left">
          <span className="text-sm text-gray-500">Topic</span>
          <span className="font-semibold break-words">{props.topic}</span>
        </div>

        <div className="flex flex-col w-[200px] text-left">
          <span className="text-sm text-gray-500">Difficulty</span>
          <span className="font-semibold break-words">{props.difficulty}</span>
        </div>

        <div className="flex flex-col w-[200px] text-left">
          <span className="text-sm text-gray-500">Time Taken</span>
          <span className="font-semibold break-words">{props.timeTaken}</span>
        </div>

        <div className="flex flex-col w-[200px] text-left">
          <span className="text-sm text-gray-500">Score</span>
          <span className="font-semibold break-words">{props.score} / {props.total} ({props.accuracy.toFixed(0)}%)</span>
        </div>

      </div>
    </div>

  );
}

export default ResultBox
