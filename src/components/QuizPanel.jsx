import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { getQuestions } from '../data/gameData';
import { getCustomName } from '../utils/helpers';
import './QuizPanel.css';

const QuizPanel = () => {
  const { customNames, setShowQuiz } = useGame();
  const questions = getQuestions();

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerChange = (questionId, answer) => {
    if (submitted) return;
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    // 检查是否所有问题都已回答
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) {
      alert(`请回答所有问题（已回答 ${answeredCount}/${questions.length}）`);
      return;
    }

    // 计算得分
    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setSubmitted(true);
  };

  const handleClose = () => {
    setShowQuiz(false);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const getOptionText = (optionId) => {
    return getCustomName(optionId, customNames);
  };

  return (
    <div className="quiz-overlay" onClick={handleClose}>
      <div className="quiz-panel" onClick={e => e.stopPropagation()}>
        <div className="quiz-header">
          <h2 className="quiz-title">推理问答</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>

        {!submitted ? (
          <>
            <div className="questions-container">
              {questions.map((question, index) => (
                <div key={question.id} className="question-item">
                  <div className="question-number">问题 {index + 1}</div>
                  <div className="question-text">{question.text}</div>

                  <div className="options-list">
                    {question.options.map(option => (
                      <label
                        key={option}
                        className={`option-label ${answers[question.id] === option ? 'selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={() => handleAnswerChange(question.id, option)}
                        />
                        <span className="option-text">{getOptionText(option)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button className="submit-quiz-button" onClick={handleSubmit}>
              提交答案
            </button>
          </>
        ) : (
          <div className="result-container">
            <div className="score-display">
              <div className="score-number">{score}</div>
              <div className="score-total">/ {questions.length}</div>
            </div>

            <div className="score-message">
              {score === questions.length ? (
                <div className="perfect">PERFECT! YOU UNCOVERED THE TRUTH!</div>
              ) : score >= questions.length / 2 ? (
                <div className="good">GOOD! CLOSE TO THE TRUTH</div>
              ) : (
                <div className="need-more">NEED MORE CLUES</div>
              )}
            </div>

            <div className="answer-review">
              <h3>答案回顾：</h3>
              {questions.map((question, index) => {
                const isCorrect = answers[question.id] === question.correct;
                return (
                  <div key={question.id} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="review-question">
                      问题 {index + 1}: {question.text}
                    </div>
                    <div className="review-answer">
                      你的答案: {getOptionText(answers[question.id])}
                      {isCorrect ? ' [CORRECT]' : ` [INCORRECT] (正确答案: ${getOptionText(question.correct)})`}
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="restart-button" onClick={handleClose}>
              返回游戏
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPanel;
