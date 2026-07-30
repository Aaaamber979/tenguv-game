import React from 'react';
import { useGame } from '../context/GameContext';
import './StatusIndicator.css';

const StatusIndicator = () => {
  const { statusIndicator } = useGame();

  const getStatusText = () => {
    switch (statusIndicator) {
      case 'idle':
        return 'STANDBY';
      case 'parsing':
        return 'ANALYZING';
      case 'success':
        return 'MATCHED';
      case 'failure':
        return 'ERROR';
      case 'warning':
        return 'PARTIAL MATCH';
      default:
        return 'STANDBY';
    }
  };

  return (
    <div className={`status-indicator status-${statusIndicator}`}>
      <div className="status-dot"></div>
      <span className="status-text">{getStatusText()}</span>
    </div>
  );
};

export default StatusIndicator;
