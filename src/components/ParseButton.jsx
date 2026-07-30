import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { getTimelineData, validateMatch, formatDialogues, formatPartialDialogue } from '../utils/helpers';
import { getTimelines } from '../data/gameData';
import './ParseButton.css';

const ParseButton = () => {
  const { 
    selectedScene, 
    selectedPeriod,
    selectedCharacters,
    clearSelectedCharacters,
    unlockDialogue,
    isDialogueUnlocked,
    setStatusIndicator,
    customNames,
    unlockedDialogues
  } = useGame();
  
  const [showDialogue, setShowDialogue] = useState(false);
  const [dialogueText, setDialogueText] = useState('');
  const [message, setMessage] = useState('');
  
  const timelines = getTimelines();

  // 当选中的场景或时间改变时，检查是否已解锁并显示
  React.useEffect(() => {
    if (selectedScene && selectedPeriod) {
      const timelineData = getTimelineData(selectedScene, selectedPeriod, timelines);
      if (timelineData) {
        // 如果show=true，默认展示（无论是否解锁）
        if (timelineData.show === true || timelineData.show === 1) {
          const text = formatDialogues(timelineData.dialogues, customNames, timelineData.show, false);
          setDialogueText(text);
          setShowDialogue(true);
          setStatusIndicator('idle');
          setMessage('');
          return;
        }
        
        // 如果已解锁，显示全部内容（查看模式，不显示分析结果）
        if (isDialogueUnlocked(selectedScene, selectedPeriod, unlockedDialogues)) {
          const text = formatDialogues(timelineData.dialogues, customNames, timelineData.show, true);
          setDialogueText(text);
          setShowDialogue(true);
          setStatusIndicator('idle');  // 查看模式使用idle状态
          setMessage('');  // 清空message
          return;
        }
      }
    }
    // 如果未解锁或未选择，隐藏对话并重置状态
    setShowDialogue(false);
    setDialogueText('');
    setStatusIndicator('idle');  // 重置为待机状态
    setMessage('');  // 清空message
  }, [selectedScene, selectedPeriod]);

  const handleParse = () => {
    if (!selectedScene || !selectedPeriod) {
      setMessage('请选择场景和时间段');
      setStatusIndicator('failure');
      return;
    }

    if (selectedCharacters.length === 0) {
      setMessage('请至少选择一个角色');
      setStatusIndicator('failure');
      return;
    }

    // 检查是否已解锁 - 已解锁的时空不能再次分析
    if (isDialogueUnlocked(selectedScene, selectedPeriod, unlockedDialogues)) {
      const timelineData = getTimelineData(selectedScene, selectedPeriod, timelines);
      if (timelineData) {
        // 已解锁，显示全部内容
        const text = formatDialogues(timelineData.dialogues, customNames, timelineData.show, true);
        setDialogueText(text);
        setShowDialogue(true);
        setStatusIndicator('success');
        setMessage('该时空已解锁，无法再次分析');
      }
      return;
    }

    // 获取正确答案
    const timelineData = getTimelineData(selectedScene, selectedPeriod, timelines);
    if (!timelineData) {
      setMessage('该时空没有数据');
      setStatusIndicator('failure');
      return;
    }

    const answerIds = timelineData.answer;

    // 验证匹配
    setStatusIndicator('parsing');
    setMessage('ANALYZING...');

    setTimeout(() => {
      const result = validateMatch(selectedCharacters, answerIds);

      if (result.isCorrect) {
        // 完全正确，解锁整条对话
        unlockDialogue(selectedScene, selectedPeriod);
        const text = formatDialogues(timelineData.dialogues, customNames, timelineData.show, true);
        setDialogueText(text);
        setShowDialogue(true);
        setStatusIndicator('success');
        setMessage('MATCH SUCCESSFUL');
        clearSelectedCharacters();
      } else if (result.hasError) {
        // 存在错误匹配，不解锁，提示声纹不匹配
        setStatusIndicator('failure');
        setMessage('VOICE PRINT MISMATCH');
        setShowDialogue(false);
      } else if (result.hasPartialMatch) {
        // 部分正确，只显示匹配正确的角色台词，错误的显示[UNRESOLVED]
        const text = formatPartialDialogue(
          timelineData.dialogues,
          customNames,
          result.correctMatches,
          result.incorrectMatches
        );
        setDialogueText(text);
        setShowDialogue(true);
        setStatusIndicator('warning');
        setMessage('PARTIAL MATCH');
      }
    }, 800);
  };

  return (
    <div className="parse-section">
      <button 
        className="parse-button"
        onClick={handleParse}
        disabled={!selectedScene || !selectedPeriod || selectedCharacters.length === 0}
      >
        ANALYZE
      </button>
      
      {message && (
        <div className={`message ${message.includes('SUCCESS') ? 'success' : message.includes('FAILED') ? 'error' : 'info'}`}>
          {message}
        </div>
      )}

      {showDialogue && dialogueText && selectedScene && selectedPeriod && (
        <div className="dialogue-display">
          <pre>{dialogueText}</pre>
        </div>
      )}
    </div>
  );
};

export default ParseButton;
