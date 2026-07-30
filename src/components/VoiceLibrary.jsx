import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { getCharacters, getTimelines } from '../data/gameData';
import { getCustomName, isDialogueUnlocked } from '../utils/helpers';
import './VoiceLibrary.css';

const VoiceLibrary = () => {
  const { 
    customNames, 
    updateCustomNames, 
    characterRemarks, 
    updateCharacterRemark,
    selectedCharacters, 
    toggleCharacter,
    selectedPeriod,
    unlockedDialogues
  } = useGame();
  
  const characters = getCharacters();
  const timelines = getTimelines();
  
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editMode, setEditMode] = useState('name');

  const handleSelectCharacter = (characterId) => {
    // 如果当前时间片该角色已在某场景解锁，不允许再次选择（一个角色在一个时间片只能出现在一个场景）
    if (selectedPeriod) {
      const hasUnlocked = timelines.some(timeline => {
        if (timeline.period === selectedPeriod && isDialogueUnlocked(timeline.sceneId, selectedPeriod, unlockedDialogues)) {
          return timeline.answer.includes(characterId);
        }
        return false;
      });
      if (hasUnlocked) return;
    }
    
    toggleCharacter(characterId);
  };

  // 检查角色在当前时间片是否已解锁（一个角色在一个时间片只能属于一个场景的已解锁对话）
  const isCharacterUnlocked = (characterId) => {
    if (!selectedPeriod) return false;
    
    return timelines.some(timeline => 
      timeline.period === selectedPeriod && 
      isDialogueUnlocked(timeline.sceneId, selectedPeriod, unlockedDialogues) &&
      timeline.answer.includes(characterId)
    );
  };

  const startEditing = (characterId, value, mode = 'name') => {
    setEditingId(characterId);
    setEditValue(value || '');
    setEditMode(mode);
  };

  const saveEdit = (characterId) => {
    if (editValue.trim()) {
      if (editMode === 'name') {
        const newNames = { ...customNames, [characterId]: editValue.trim() };
        updateCustomNames(newNames);
      } else {
        updateCharacterRemark(characterId, editValue.trim());
      }
    }
    setEditingId(null);
    setEditValue('');
    setEditMode('name');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
    setEditMode('name');
  };

  return (
    <div className="voice-library">
      <div className="panel-header">
        <span className="panel-title">VOICE PRINTS</span>
      </div>
      
      <div className="character-list">
        {characters.map(character => {
          const isSelected = selectedCharacters.includes(character.id);
          const displayName = getCustomName(character.id, customNames);
          const remark = characterRemarks[character.id];
          
          // 检查是否已解锁
          const isLocked = isCharacterUnlocked(character.id);
          const isEditing = editingId === character.id;
          
          return (
            <div
              key={character.id}
              className={`character-item ${isSelected ? 'selected' : ''} ${isLocked ? 'locked' : ''}`}
            >
              <div 
                className="character-select-area"
                onClick={() => !isLocked && handleSelectCharacter(character.id)}
              >
                <div className="character-indicator">
                  <div className={`indicator-box ${isSelected ? 'active' : ''}`}></div>
                </div>
                
                <div className="character-content">
                  {isEditing && editMode === 'name' ? (
                    <input
                      type="text"
                      className="inline-input"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => saveEdit(character.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(character.id);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                  ) : (
                    <div 
                      className="character-name"
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        startEditing(character.id, displayName, 'name');
                      }}
                    >
                      {displayName}
                    </div>
                  )}
                  
                  {isEditing && editMode === 'remark' ? (
                    <input
                      type="text"
                      className="inline-input"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => saveEdit(character.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(character.id);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                  ) : (
                    remark && <div className="character-remark">{remark}</div>
                  )}
                  
                  <div className="character-id">{character.id}</div>
                </div>
              </div>
              
              <button 
                className="char-config-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing(character.id, displayName, 'name');
                }}
              >
                ⚙
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VoiceLibrary;
