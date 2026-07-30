import React from 'react';
import { hasGameSave, loadGameSaveFromStorage } from '../utils/storage';
import './SaveSelectModal.css';

const SaveSelectModal = ({ gameSource, onNewGame, onContinueGame, onCancel }) => {
  const hasSave = hasGameSave(gameSource);
  const saveData = hasSave ? loadGameSaveFromStorage(gameSource) : null;
  
  // 格式化时间戳
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="save-modal-overlay" onClick={onCancel}>
      <div className="save-modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">GAME SELECTION</h2>
        
        {hasSave && saveData && (
          <div className="save-info">
            <p className="save-label">SAVED PROGRESS DETECTED</p>
            <p className="save-time">{formatTimestamp(saveData.timestamp)}</p>
            {saveData.unlockedDialogues && saveData.unlockedDialogues.length > 0 && (
              <p className="save-progress">
                Progress: {saveData.unlockedDialogues.length} dialogue(s) unlocked
              </p>
            )}
          </div>
        )}
        
        <div className="modal-buttons">
          <button 
            className="btn-new-game"
            onClick={onNewGame}
          >
            新游戏
          </button>
          
          <button 
            className="btn-continue"
            onClick={onContinueGame}
            disabled={!hasSave}
          >
            {hasSave ? '继续游戏' : '继续游戏（无存档）'}
          </button>
        </div>
        
        <button className="btn-cancel" onClick={onCancel}>
          CANCEL
        </button>
      </div>
    </div>
  );
};

export default SaveSelectModal;
