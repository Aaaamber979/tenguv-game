import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadGameData, getTimelines } from '../data/gameData';
import {
  loadCustomNames, saveCustomNames,
  loadUnlockedDialogues, saveUnlockedDialogues,
  loadGameSaveFromStorage, saveGameProgressToStorage,
  hasGameSave, clearGameSave
} from '../utils/storage';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  // 自定义名称映射
  const [customNames, setCustomNames] = useState({});

  // 角色备注映射
  const [characterRemarks, setCharacterRemarks] = useState({});

  // 已解锁的对话列表，格式: ["s1_1", "s2_2", ...]
  const [unlockedDialogues, setUnlockedDialogues] = useState([]);

  // 当前选中的场景ID
  const [selectedScene, setSelectedScene] = useState(null);

  // 当前选中的时间段
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  // 当前选中的角色ID数组（多选）
  const [selectedCharacters, setSelectedCharacters] = useState([]);

  // 状态指示器状态: idle | parsing | success | failure
  const [statusIndicator, setStatusIndicator] = useState('idle');

  // 是否显示问答环节
  const [showQuiz, setShowQuiz] = useState(false);

  // 监听unlockedDialogues变化
  useEffect(() => {
    // Debug log removed for production
  }, [unlockedDialogues]);

  // 初始化时从localStorage加载数据
  useEffect(() => {
    const gameSource = window.__GAME_SOURCE__;

    if (!gameSource) return;

    // 总是先清空所有状态（确保干净启动）
    setCustomNames({});
    setCharacterRemarks({});
    setUnlockedDialogues([]);
    setSelectedScene(null);
    setSelectedPeriod(null);
    setSelectedCharacters([]);

    if (!gameSource) return;

    // 首先确保游戏数据已加载（这会设置 window.__DEFAULT_UNLOCKED__）
    loadGameData(gameSource).then(() => {
      // 尝试加载游戏存档
      const savedGame = loadGameSaveFromStorage(gameSource);

      if (savedGame && savedGame.unlockedDialogues && savedGame.unlockedDialogues.length > 0) {
        // 有存档且有解锁的对话，恢复存档数据
        setCustomNames(savedGame.customNames || {});
        setCharacterRemarks(savedGame.characterRemarks || {});
        setUnlockedDialogues(savedGame.unlockedDialogues);
        setSelectedScene(savedGame.selectedScene || null);
        setSelectedPeriod(savedGame.selectedPeriod || null);
        setSelectedCharacters(savedGame.selectedCharacters || []);
      } else {
        // 没有存档，加载默认解锁的对话（show=true的timelines）
        const defaultUnlocked = window.__DEFAULT_UNLOCKED__ || [];
        // 立即设置 unlockedDialogues，不等待其他操作
        setUnlockedDialogues(defaultUnlocked);
      }
    });
  }, []);

  // 保存自定义名称
  const updateCustomNames = (names) => {
    setCustomNames(names);
    saveCustomNames(names);
  };

  // 更新角色备注
  const updateCharacterRemark = (characterId, remark) => {
    setCharacterRemarks(prev => ({
      ...prev,
      [characterId]: remark
    }));
  };

  // 解锁对话
  const unlockDialogue = (sceneId, period) => {
    const key = `${sceneId}_${period}`;
    if (!unlockedDialogues.includes(key)) {
      const newUnlocked = [...unlockedDialogues, key];
      setUnlockedDialogues(newUnlocked);
      saveUnlockedDialogues(newUnlocked);
    }
  };

  // 检查对话是否已解锁
  const isDialogueUnlocked = (sceneId, period) => {
    const key = `${sceneId}_${period}`;
    return unlockedDialogues.includes(key);
  };

  // 切换角色选中状态
  const toggleCharacter = (characterId) => {
    setSelectedCharacters(prev => {
      if (prev.includes(characterId)) {
        return prev.filter(id => id !== characterId);
      } else {
        return [...prev, characterId];
      }
    });
  };

  // 清空选中的角色
  const clearSelectedCharacters = () => {
    setSelectedCharacters([]);
  };

  // 保存游戏进度
  const saveGameProgress = () => {
    const gameSource = window.__GAME_SOURCE__;
    if (!gameSource) {
      console.warn('No game source specified');
      return false;
    }

    const gameState = {
      customNames,
      characterRemarks,
      unlockedDialogues,
      selectedScene,
      selectedPeriod,
      selectedCharacters
    };

    try {
      saveGameProgressToStorage(gameSource, gameState);
      return true;
    } catch (error) {
      console.error('Failed to save game progress:', error);
      return false;
    }
  };

  // 清除当前游戏存档
  const clearCurrentGameSave = () => {
    const gameSource = window.__GAME_SOURCE__;
    if (gameSource) {
      clearGameSave(gameSource);
    }
  };

  const value = {
    customNames,
    updateCustomNames,
    characterRemarks,
    updateCharacterRemark,

    unlockedDialogues,
    unlockDialogue,
    isDialogueUnlocked,

    selectedScene,
    setSelectedScene,

    selectedPeriod,
    setSelectedPeriod,

    selectedCharacters,
    toggleCharacter,
    clearSelectedCharacters,

    statusIndicator,
    setStatusIndicator,

    showQuiz,
    setShowQuiz,

    saveGameProgress,
    clearCurrentGameSave
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
