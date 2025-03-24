import React, { useEffect, useState } from 'react';
import ResultBox from '../../assets/ResultBox';
import { useNavigate } from 'react-router-dom';


function Results() {
  const token = localStorage.getItem('token');
  console.log(token);
  const navigate = useNavigate();
  if (token === null) {
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

  return (
    results.map(result => (
      <ResultBox 
        score={result.score} 
        total={result.totalQuestions} 
        timeTaken={result.timeTaken} 
        date={result.date}  
        topic={result.topic} 
        difficulty={result.difficulty} 
      />
    ))
  );
}

export default Results;