import { useState, useEffect } from "react";

const shuffleArray = (arr) => {
  let newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }

  if (JSON.stringify(newArr) === JSON.stringify(arr)) {
    // Recursively shuffle again until the array is different
    return shuffleArray(arr);
  }
  return newArr;
};

const getRandomIndex = (total) => Math.floor(Math.random() * total);

const createShellsPositions = (total) =>
  Array(total)
    .fill(null)
    .map((_, i) => (i - Math.floor(total / 2)) * 2);

export const useGameLogic = (
  totalShells = 3,
  duration = 300,
  totalShuffles = 5
) => {
  const initPositions = createShellsPositions(totalShells);

  const [shuffleState, setShuffleState] = useState({
    ballIndex: getRandomIndex(totalShells),
    positions: initPositions,
    lastPositions: initPositions,
    shuffling: false,
    shuffleCount: 0,
  });

  const { ballIndex, shuffling, shuffleCount, playing } = shuffleState;

  const reset = () => {
    const shellPositions = createShellsPositions(totalShells);
    setShuffleState({
      ballIndex: getRandomIndex(totalShells),
      positions: shellPositions,
      lastPositions: shellPositions,
      shuffling: false,
      shuffleCount: 0,
      playing: false,
    });
  };

  const resetBall = () => {
    setShuffleState((prevState) => ({
      ...prevState,
      ballIndex: -1,
    }));
    reset();
  };

  // Reset the ball position and shuffle state when totalShells changes
  useEffect(() => {
    reset();
  }, [totalShells]);

  // Perform the shuffle when appropriate
  useEffect(() => {
    if (shuffleCount < totalShuffles && !shuffling && playing) {
      const shuffleShells = () => {
        setShuffleState((prevState) => ({
          ...prevState,
          positions: shuffleArray(prevState.positions),
          lastPositions: prevState.positions,
          shuffling: true,
          shuffleCount: prevState.shuffleCount + 1,
        }));

        setTimeout(() => {
          setShuffleState((prevState) => ({
            ...prevState,
            shuffling: false,
          }));
        }, duration * 2.2);
      };

      shuffleShells();
    }
  }, [shuffleCount, totalShuffles, shuffling, playing, duration]);

  const [transparent, setTransparent] = useState(false);
  const toggleCheatMode = () => setTransparent(!transparent);

  const [playerGuess, setPlayerGuess] = useState(null);
  const [gameResult, setResult] = useState(null);

  const playGame = () => {
    setShuffleState((prevState) => ({
      ...prevState,
      playing: true,
      shuffleCount: 0,
    }));
  };

  const handleShellClick = (index) => {
    if (playerGuess === null) {
      setPlayerGuess(index);
      setResult(index === ballIndex);
    }
  };

  return {
    shuffleState,
    playGame,
    resetBall,
    toggleCheatMode,
    handleShellClick,
    playerGuess,
    playing,
    gameResult,
    transparent,
  };
};
