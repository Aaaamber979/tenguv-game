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
    
    setAnswers(prev => {
      const question = questions.find(q => q.id === questionId);
      const isMultiple = Array.isArray(question?.correct);
      
      if (isMultiple) {
        // 多选题：使用数组存储
        const currentAnswers = prev[questionId] || [];
        if (currentAnswers.includes(answer)) {
          // 取消选择
          return {
            ...prev,
            [questionId]: currentAnswers.filter(a => a !== answer)
          };
        } else {
          // 添加选择
          return {
            ...prev,
            [questionId]: [...currentAnswers, answer]
          };
        }
      } else {
        // 单选题：直接替换
        return {
          ...prev,
          [questionId]: answer
        };
      }
    });
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
      const userAnswer = answers[q.id];
      const correctAnswer = q.correct;
      
      if (Array.isArray(correctAnswer)) {
        // 多选题：比较数组内容（顺序无关）
        const isCorrect = Array.isArray(userAnswer) && 
          userAnswer.length === correctAnswer.length &&
          userAnswer.every(ans => correctAnswer.includes(ans)) &&
          correctAnswer.every(ans => userAnswer.includes(ans));
        if (isCorrect) correctCount++;
      } else {
        // 单选题：直接比较
        if (userAnswer === correctAnswer) {
          correctCount++;
        }
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
                    {question.options.map(option => {
                      const isMultiple = Array.isArray(question.correct);
                      const isSelected = isMultiple 
                        ? (answers[question.id] || []).includes(option)
                        : answers[question.id] === option;
                      
                      return (
                        <label
                          key={option}
                          className={`option-label ${isSelected ? 'selected' : ''}`}
                        >
                          <input
                            type={isMultiple ? 'checkbox' : 'radio'}
                            name={isMultiple ? undefined : `question-${question.id}`}
                            value={option}
                            checked={isSelected}
                            onChange={() => handleAnswerChange(question.id, option)}
                          />
                          <span className="option-text">{getOptionText(option)}</span>
                        </label>
                      );
                    })}
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
                const userAnswer = answers[question.id];
                const correctAnswer = question.correct;
                const isMultiple = Array.isArray(correctAnswer);
                
                let isCorrect;
                if (isMultiple) {
                  isCorrect = Array.isArray(userAnswer) && 
                    userAnswer.length === correctAnswer.length &&
                    userAnswer.every(ans => correctAnswer.includes(ans)) &&
                    correctAnswer.every(ans => userAnswer.includes(ans));
                } else {
                  isCorrect = userAnswer === correctAnswer;
                }
                
                // 格式化用户答案显示
                const formatUserAnswer = () => {
                  if (isMultiple && Array.isArray(userAnswer)) {
                    return userAnswer.map(ans => getOptionText(ans)).join('、');
                  }
                  return getOptionText(userAnswer);
                };
                
                // 格式化正确答案显示
                const formatCorrectAnswer = () => {
                  if (isMultiple && Array.isArray(correctAnswer)) {
                    return correctAnswer.map(ans => getOptionText(ans)).join('、');
                  }
                  return getOptionText(correctAnswer);
                };
                
                return (
                  <div key={question.id} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="review-question">
                      问题 {index + 1}: {question.text}
                      {isMultiple && <span className="question-type">（多选）</span>}
                    </div>
                    <div className="review-answer">
                      你的答案: {formatUserAnswer()}
                      {isCorrect ? ' [CORRECT]' : ` [INCORRECT] (正确答案: ${formatCorrectAnswer()})`}
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
