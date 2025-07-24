import React, { useEffect, useState } from 'react';
import ResultBox from '../../assets/ResultBox';
import BarChart from '../../assets/BarChart';
import PieChart from '../../assets/PieChart';
import { useNavigate } from 'react-router-dom';

function Results() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/Login');
    }
  }, [token, navigate]);

  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5175/GetUserResults/${token}`)
      .then(response => response.json())
      .then(data => setResults(data))
      .catch(err => console.error("Failed to fetch results:", err));
  }, []);

  // Function to format time taken (seconds to MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Aggregate accuracy for BarChart
  const averageAccuracy = (difficulty) => {
    const filteredResults = results.filter(r => r.difficulty === difficulty);
    const totalAccuracy = filteredResults.reduce((sum, r) => sum + r.accuracy, 0);
    return filteredResults.length ? totalAccuracy / filteredResults.length : 0;
  };

  // Aggregate difficulty distribution for PieChart
  const difficultyCount = results.reduce((acc, result) => {
    acc[result.difficulty.toLowerCase()] += 1;
    return acc;
  }, { easy: 0, medium: 0, hard: 0 });

  return (
    <div>
      <div className="flex flex-wrap justify-between m-10 ml-20 mr-20">
        <div className="flex flex-col">
            <BarChart results={results} />
        </div>

        <div className="flex flex-col">
            <PieChart data={difficultyCount} />
        </div>
      </div>

      {/* List of results */}
      <div>
        {results.map((result, index) => (
          <ResultBox
            key={result._id || index}  // Use _id if available, otherwise fallback to index
            score={result.score}
            total={result.totalQuestions}
            timeTaken={formatTime(result.timeTaken)}  // Formatted time
            date={formatDate(result.date)}  // Formatted date
            topic={result.topic}
            difficulty={result.difficulty}
            accuracy={result.accuracy}
            quiz={result.quiz}
          />
        ))}
      </div>
    </div>
  );
}

export default Results;