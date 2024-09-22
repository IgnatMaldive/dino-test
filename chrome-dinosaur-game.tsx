import React, { useState, useEffect, useCallback } from 'react';

const DinosaurGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [dinoPosition, setDinoPosition] = useState(0);
  const [obstaclePosition, setObstaclePosition] = useState(400);
  const [isJumping, setIsJumping] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setDinoPosition(0);
    setObstaclePosition(400);
    setIsJumping(false);
  };

  const jump = useCallback(() => {
    if (!isJumping) {
      setIsJumping(true);
      setDinoPosition(100);
      setTimeout(() => {
        setDinoPosition(0);
        setIsJumping(false);
      }, 500);
    }
  }, [isJumping]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Space') {
        if (!gameStarted) {
          startGame();
        } else {
          jump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, jump]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const gameLoop = setInterval(() => {
        setObstaclePosition((prevPosition) => {
          if (prevPosition <= -20) {
            return 400;
          }
          return prevPosition - 5;
        });

        setScore((prevScore) => prevScore + 1);

        if (obstaclePosition > 0 && obstaclePosition < 50 && dinoPosition < 50) {
          clearInterval(gameLoop);
          setGameOver(true);
          setHighScore((prevHighScore) => Math.max(prevHighScore, score));
        }
      }, 20);

      return () => clearInterval(gameLoop);
    }
  }, [gameStarted, gameOver, obstaclePosition, dinoPosition, score]);

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Chrome Dinosaur Game</h1>
      <div className="h-48 bg-white relative overflow-hidden">
        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={startGame}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Start Game
            </button>
          </div>
        )}
        {gameStarted && (
          <>
            <div
              className="absolute bottom-0 left-10 text-4xl"
              style={{
                transform: `scaleX(-1) translateY(-${dinoPosition}px)`,
                display: 'inline-block'
              }}
            >
              🦖
            </div>
            <div
              className="absolute bottom-0 text-4xl"
              style={{ left: `${obstaclePosition}px` }}
            >
              🌵
            </div>
          </>
        )}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white text-center">
              <p className="text-xl font-bold mb-2">Game Over</p>
              <button
                onClick={startGame}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-between">
        <p>Score: {score}</p>
        <p>High Score: {highScore}</p>
      </div>
      <p className="mt-2 text-sm text-gray-600">
        Press space bar to start and jump
      </p>
    </div>
  );
};

export default DinosaurGame;
