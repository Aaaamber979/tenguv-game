import React, { useState, useEffect } from 'react';
import './GameList.css';

const GameList = ({ onSelectGame, onViewManual }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGameList = async () => {
      try {
        const response = await fetch('/game_list.json');
        if (!response.ok) {
          throw new Error('Failed to load game list');
        }
        const data = await response.json();
        setGames(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading game list:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadGameList();
  }, []);

  const handleSelectGame = (game) => {
    onSelectGame(game.source);
  };

  if (loading) {
    return (
      <div className="game-list-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>LOADING GAMES...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-list-container">
        <div className="error-state">
          <p>ERROR: {error}</p>
          <button onClick={() => window.location.reload()}>RETRY</button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-list-container">
      <header className="game-list-header">
        <h1 className="main-title">天狗系统</h1>
        <p className="sub-title">TENGUVOX</p>
        <p className="subtitle">VOICE PRINT DETECTION SYSTEM</p>
        <button className="manual-button" onClick={onViewManual}>系统手册</button>
      </header>

      <div className="game-grid">
        {games.map((game, index) => (
          <div
            key={index}
            className="game-card"
            onClick={() => handleSelectGame(game)}
          >
            <div className="game-card-content">
              <h2 className="game-name">{game.name}</h2>
              <div className="game-status">
                <span className="status-dot"></span>
                <span className="status-text">可用 AVAILABLE</span>
              </div>
            </div>
            <div className="game-arrow">→</div>
          </div>
        ))}
      </div>

      <footer className="game-list-footer">
        <p>选择一个案件开始调查</p>
        <p>SELECT A CASE TO BEGIN INVESTIGATION</p>
      </footer>
    </div>
  );
};

export default GameList;
