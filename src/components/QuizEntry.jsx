import React from 'react';
import { useGame } from '../context/GameContext';
import './QuizEntry.css';

const QuizEntry = () => {
  const { setShowQuiz } = useGame();

  return (
    <div className="quiz-entry">
      <button 
        className="quiz-button"
        onClick={() => setShowQuiz(true)}
      >
        START QUIZ
      </button>
    </div>
  );
};

export default QuizEntry;
