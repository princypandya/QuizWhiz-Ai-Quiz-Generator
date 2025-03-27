import React, { useEffect, useState } from 'react';
import ResultBox from '../../assets/ResultBox';
import { useNavigate } from 'react-router-dom';

function Results() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  
  // Redirect if no token
  if (!token) {
    navigate('/Login');
    return null;
  }

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

  return (
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
        />
      ))}
    </div>
  );
}

export default Results;