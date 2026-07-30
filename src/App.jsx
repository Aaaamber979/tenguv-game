import { useState } from 'react';
import GameList from './components/GameList';
import GameBoard from './components/GameBoard';
import SaveSelectModal from './components/SaveSelectModal';
import SystemManual from './components/SystemManual';
import { hasGameSave, clearGameSave } from './utils/storage';
import { clearGameDataCache } from './data/gameData';
import { GameProvider } from './context/GameContext';

// 旧的存储key（兼容清理）
const OLD_STORAGE_KEYS = ['tenguvCustomNames', 'tenguvUnlocked'];

function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [pendingGameSource, setPendingGameSource] = useState(null);
  const [gameKey, setGameKey] = useState(0);  // 用于强制重新挂载GameBoard
  const [isStartingNewGame, setIsStartingNewGame] = useState(false);  // 标记是否正在启动新游戏
  const [showManual, setShowManual] = useState(false);  // 显示系统说明页面

  const handleSelectGame = (gameSource) => {
    setPendingGameSource(gameSource);
    setShowSaveModal(true);  // 始终显示选择框
  };

  const startNewGame = (gameSource) => {
    // 先设置全局变量
    window.__GAME_SOURCE__ = gameSource;

    // 然后递增key强制重新挂载（确保全局变量已设置）
    setGameKey(prev => prev + 1);
    setSelectedGame(gameSource);
  };

  const handleNewGame = () => {
    // 清除新存档系统的数据
    clearGameSave(pendingGameSource);

    // 清除旧存储系统的数据（兼容）
    OLD_STORAGE_KEYS.forEach(key => {
      localStorage.removeItem(key);
    });

    // 清除游戏数据缓存（内存中的gameData）
    clearGameDataCache();

    // 设置标志位表示正在启动新游戏
    setIsStartingNewGame(true);

    // 使用setTimeout确保所有清理完成
    setTimeout(() => {
      // 递增key强制重新挂载
      setGameKey(prev => prev + 1);
      setSelectedGame(pendingGameSource);
      setShowSaveModal(false);
      // 重置标志位
      setTimeout(() => setIsStartingNewGame(false), 0);
    }, 100);  // 增加延迟确保清理完成
  };

  const handleContinueGame = () => {
    startNewGame(pendingGameSource);
    setShowSaveModal(false);
  };

  const handleCancelModal = () => {
    setShowSaveModal(false);
    setPendingGameSource(null);
  };

  const handleViewManual = () => {
    setShowManual(true);
  };

  const handleBackFromManual = () => {
    setShowManual(false);
  };

  const handleReturnToList = () => {
    // 清除游戏源和标志位
    window.__GAME_SOURCE__ = null;
    window.__SKIP_SAVE_LOAD__ = false;
    setSelectedGame(null);
    setPendingGameSource(null);
  };

  // 如果显示系统说明页面
  if (showManual) {
    return <SystemManual onBack={handleBackFromManual} />;
  }

  // 如果选择了游戏，显示游戏面板（使用独立的GameProvider确保状态隔离）
  if (selectedGame) {
    return (
      <GameProvider key={gameKey}>
        <GameBoard
          gameSource={selectedGame}
          skipSaveLoad={isStartingNewGame}
          onReturnToList={handleReturnToList}
        />
      </GameProvider>
    );
  }

  // 否则显示游戏列表
  return (
    <>
      <GameList onSelectGame={handleSelectGame} onViewManual={handleViewManual} />
      {showSaveModal && pendingGameSource && (
        <SaveSelectModal
          gameSource={pendingGameSource}
          onNewGame={handleNewGame}
          onContinueGame={handleContinueGame}
          onCancel={handleCancelModal}
        />
      )}
    </>
  );
}

export default App;
