import React from 'react';
import { useGame } from '../context/GameContext';
import { getTimelines, getUniquePeriods, getScenes } from '../data/gameData';
import './Timeline.css';

const Timeline = () => {
  const { selectedPeriod, setSelectedPeriod, clearSelectedCharacters, setSelectedScene, unlockedDialogues } = useGame();
  const timelines = getTimelines();
  const periods = getUniquePeriods(timelines);
  const scenes = getScenes();

  // 计算每个时间片已解锁和未解锁的场景数量
  const getUnlockedCountForPeriod = (period) => {
    // 获取该时间片涉及的所有场景ID
    const sceneIdsInPeriod = [...new Set(
      timelines
        .filter(t => t.period === period)
        .map(t => t.sceneId)
    )];

    // 计算已解锁的数量
    const unlockedCount = sceneIdsInPeriod.filter(sceneId =>
      unlockedDialogues.includes(`${sceneId}_${period}`)
    ).length;

    // 计算未解锁数量
    const lockedCount = sceneIdsInPeriod.length - unlockedCount;

    return { unlockedCount, lockedCount };
  };

  const handlePeriodClick = (period) => {
    setSelectedPeriod(period);
    clearSelectedCharacters(); // 清空角色选择
    setSelectedScene(null); // 清空场景选择
  };

  return (
    <div className="timeline">
      <div className="timeline-list">
        {periods.map(period => {
          const { unlockedCount, lockedCount } = getUnlockedCountForPeriod(period);
          const hasUnlocked = unlockedCount > 0;
          const hasLocked = lockedCount > 0;

          return (
            <div
              key={period}
              className={`timeline-item ${selectedPeriod === period ? 'active' : ''}`}
              onClick={() => handlePeriodClick(period)}
            >
              <span className="timeline-label">T-{period}</span>
              {hasUnlocked && (
                <span className="timeline-badge timeline-badge-unlocked">{unlockedCount}</span>
              )}
              {hasLocked && (
                <span className="timeline-badge timeline-badge-locked">{lockedCount}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
