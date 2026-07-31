import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { loadGameData, getMeta } from '../data/gameData';
import StatusIndicator from './StatusIndicator';
import Timeline from './Timeline';
import SceneMap from './SceneMap';
import VoiceLibrary from './VoiceLibrary';
import ParseButton from './ParseButton';
import QuizEntry from './QuizEntry';
import QuizPanel from './QuizPanel';
import ConfirmModal from './ConfirmModal';
import './GameBoard.css';

const GameBoard = ({ onReturnToList, gameSource, skipSaveLoad }) => {
  const { showQuiz, saveGameProgress } = useGame();
  const [gameLoaded, setGameLoaded] = React.useState(false);
  const [meta, setMeta] = React.useState({});
  const [showSaveConfirm, setShowSaveConfirm] = React.useState(false);
  const [showReturnConfirm, setShowReturnConfirm] = React.useState(false);

  // 在组件挂载的最开始设置全局变量（确保在GameContext useEffect之前执行）
  React.useLayoutEffect(() => {
    if (gameSource) {
      window.__GAME_SOURCE__ = gameSource;
      window.__SKIP_SAVE_LOAD__ = skipSaveLoad || false;
    }
  }, [gameSource, skipSaveLoad]);

  useEffect(() => {
    const initGame = async () => {
      try {
        // 使用window.__GAME_SOURCE__获取游戏文件路径
        const gameSource = window.__GAME_SOURCE__ || '/game.json';
        await loadGameData(gameSource);
        setMeta(getMeta());
        setGameLoaded(true);
      } catch (error) {
        console.error('游戏加载失败:', error);
        alert(`游戏数据加载失败: ${error.message}`);
      }
    };

    initGame();
  }, []);

  if (!gameLoaded) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>SYSTEM INITIALIZING...</p>
      </div>
    );
  }

  const handleSaveProgress = () => {
    setShowSaveConfirm(true);
  };

  const handleConfirmSave = () => {
    const success = saveGameProgress();
    setShowSaveConfirm(false);
    if (success) {
      console.log('进度已保存');
    }
  };

  const handleReturnToList = () => {
    setShowReturnConfirm(true);
  };

  const handleConfirmReturn = () => {
    setShowReturnConfirm(false);
    onReturnToList();
  };

  return (
    <div className="game-board">
      {/* 工具栏 */}
      <div className="game-toolbar">
        <button onClick={handleSaveProgress}>保存进度</button>
        <button onClick={handleReturnToList}>返回列表</button>
        <div className="toolbar-right">
          <QuizEntry />
        </div>
      </div>

      {/* 保存确认弹窗 */}
      {showSaveConfirm && (
        <ConfirmModal
          title="保存进度"
          message="确定要保存当前游戏进度吗？这将覆盖之前的存档。"
          onConfirm={handleConfirmSave}
          onCancel={() => setShowSaveConfirm(false)}
          confirmText="确认保存"
          cancelText="取消"
        />
      )}

      {/* 返回列表确认弹窗 */}
      {showReturnConfirm && (
        <ConfirmModal
          title="返回列表"
          message="确定要返回到游戏列表吗？未保存的进度将会丢失。"
          onConfirm={handleConfirmReturn}
          onCancel={() => setShowReturnConfirm(false)}
          confirmText="确认返回"
          cancelText="取消"
        />
      )}

      <StatusIndicator />

      <header className="game-header">
        <h1 className="game-title">{meta.title || 'TENGUVOX'}</h1>
        {meta.description && (
          <p className="game-description">{meta.description}</p>
        )}
      </header>

      <main className="game-content">
        {/* 顶部时间轴 */}
        <div className="top-bar">
          <Timeline />
        </div>

        {/* 主体内容区 */}
        <div className="main-area">
          {/* 左侧：场景库 */}
          <div className="left-section">
            <SceneMap />
          </div>

          {/* 中间：对话区 */}
          <div className="middle-section">
            <ParseButton />
          </div>

          {/* 右侧：声纹库 */}
          <div className="right-section">
            <VoiceLibrary />
          </div>
        </div>
      </main>

      {showQuiz && <QuizPanel />}
    </div>
  );
};

export default GameBoard;
