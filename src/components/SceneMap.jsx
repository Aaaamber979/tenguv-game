import React from 'react';
import { useGame } from '../context/GameContext';
import { getScenes, getTimelines, getCharacters } from '../data/gameData';
import { getUnlockedCharacters, getCustomName, isDialogueUnlocked } from '../utils/helpers';
import './SceneMap.css';

const GRID_SIZE = 100; // 每个网格单元的基础像素大小（从 140 缩小到 100）
const SCENE_PADDING = 12; // 场景之间的间距（从 20 缩小到 12）

const SceneMap = () => {
  const { selectedScene, setSelectedScene, selectedPeriod, unlockedDialogues, customNames } = useGame();
  const scenes = getScenes();
  const timelines = getTimelines();
  const characters = getCharacters();

  const handleSceneClick = (sceneId) => {
    // 允许点击已解锁的场景（用于查看对话）
    setSelectedScene(sceneId);
  };

  const getUnlockedCharsForScene = (sceneId) => {
    if (!selectedPeriod) return null;
    return getUnlockedCharacters(sceneId, selectedPeriod, timelines, unlockedDialogues);
  };

  // 计算容器高度和宽度（考虑场景的宽高和间距）
  const maxY = Math.max(...scenes.map(s => s.y + (s.height || 1)), 0);
  const maxX = Math.max(...scenes.map(s => s.x + (s.width || 1)), 0);
  const containerHeight = maxY * (GRID_SIZE + SCENE_PADDING) + SCENE_PADDING * 2;
  const containerWidth = maxX * (GRID_SIZE + SCENE_PADDING) + SCENE_PADDING * 2;

  // 计算每个场景的实际位置（基于前一行的实际高度）
  const getScenePosition = (scene) => {
    // 找到当前场景所在行之前的所有场景中，最大的 y + height
    const previousScenes = scenes.filter(s => s.y < scene.y);
    let maxPreviousY = 0;

    if (previousScenes.length > 0) {
      // 找到前一行的最大底部位置
      const prevRowMaxY = Math.max(...previousScenes.map(s => s.y + (s.height || 1)));
      maxPreviousY = prevRowMaxY;
    }

    // 如果当前场景不在第一行，需要计算偏移量
    if (scene.y > 0 && maxPreviousY < scene.y) {
      // 有间隙，需要调整位置
      return {
        left: scene.x * (GRID_SIZE + SCENE_PADDING) + SCENE_PADDING,
        top: maxPreviousY * (GRID_SIZE + SCENE_PADDING) + SCENE_PADDING
      };
    }

    // 默认计算方式
    return {
      left: scene.x * (GRID_SIZE + SCENE_PADDING) + SCENE_PADDING,
      top: scene.y * (GRID_SIZE + SCENE_PADDING) + SCENE_PADDING
    };
  };

  return (
    <div className="scene-map">
      <div className="panel-header">
        <span className="panel-title">SCENE MAP</span>
        <span className="panel-indicator"></span>
      </div>

      <div className="scene-container" style={{ height: `${Math.min(containerHeight, 550)}px`, width: `${containerWidth}px`, maxHeight: '550px' }}>
        {scenes.map(scene => {
          const unlockedChars = getUnlockedCharsForScene(scene.id);
          const isSelected = selectedScene === scene.id;
          const isUnlocked = selectedPeriod && isDialogueUnlocked(scene.id, selectedPeriod, unlockedDialogues);

          return (
            <div
              key={scene.id}
              className={`scene-node ${isSelected ? 'active' : ''} ${isUnlocked ? 'unlocked' : ''}`}
              onClick={() => handleSceneClick(scene.id)}
              style={{
                left: `${getScenePosition(scene).left}px`,
                top: `${getScenePosition(scene).top}px`,
                width: `${(scene.width || 1) * GRID_SIZE + ((scene.width || 1) - 1) * SCENE_PADDING}px`,
                height: `${(scene.height || 1) * GRID_SIZE + ((scene.height || 1) - 1) * SCENE_PADDING}px`,
                position: 'absolute'
              }}
            >
              <div className="node-3d" style={{ width: '100%', height: '100%' }}>
                <div className="node-face front" style={{ width: '100%', height: '100%' }}>
                  <div className="node-name">{scene.name}</div>
                </div>
                <div className="node-face top"></div>
                <div className="node-face right"></div>
              </div>

              {unlockedChars && unlockedChars.length > 0 && (
                <div className="unlocked-indicator">
                  <div className="indicator-dot"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedScene && (
        <div className="scene-info">
          <span className="info-label">SELECTED:</span>
          <span className="info-value">{scenes.find(s => s.id === selectedScene)?.name}</span>
        </div>
      )}

      {/* 如果当前选中的时空已解锁，显示人物列表 */}
      {selectedScene && selectedPeriod && isDialogueUnlocked(selectedScene, selectedPeriod, unlockedDialogues) && (
        <div className="unlocked-characters">
          <div className="section-label">UNLOCKED CHARACTERS</div>
          <div className="character-tags">
            {getUnlockedCharsForScene(selectedScene)?.map(charId => {
              const character = characters.find(c => c === charId);
              return (
                <div key={charId} className="char-tag">
                  {getCustomName(charId, customNames)}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SceneMap;
