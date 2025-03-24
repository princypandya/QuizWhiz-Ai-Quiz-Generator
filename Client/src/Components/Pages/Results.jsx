import React from 'react';
import ResultBox from '../../assets/ResultBox';

function Results() {
  const token = localStorage.getItem('token');
  console.log(token);
  if (token === null) {
    window.location.href = '/Login';
    return null;
  }
  return (
    <ResultBox 
      score={85} 
      total={100} 
      timeTaken="5m 20s" 
      date="2025-03-23"  
      topic="JavaScript Basics" 
      difficulty="Medium" 
    />
  );
}

export default Results;