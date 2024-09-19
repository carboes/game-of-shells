import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Confetti from './ExplosionConfetti';
import { Shell } from './Shell';
import { GameText } from './GameText';
import { useGameLogic } from './useGameLogic';
import { Leva } from 'leva';

export const Game = ({ totalShells = 3, duration = 300, totalShuffles = 5 }) => {
  const {
    shuffleState: { ballIndex, positions, lastPositions, shuffleCount, playing },
    playGame,
    resetBall,
    toggleCheatMode,
    handleShellClick,
    playerGuess,
    gameResult,
    transparent
  } = useGameLogic(totalShells, duration, totalShuffles);

  return (
    <>
      <Leva hidden={playing} />
      <Canvas camera={{ position: [0, -7, 7], fov: 50 }} height={500} shadows>
        <Environment preset="studio" background />
        <ambientLight intensity={0.5} />
        <directionalLight position={[3.3, 1.0, 4.4]} intensity={4} castShadow />
        <pointLight position={[10, 10, 10]} />

        <mesh receiveShadow rotation={[0, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry attach="geometry" args={[500, 500]} />
          <meshStandardMaterial attach="material" color="red" metalness={0.5} roughness={0.5} />
        </mesh>

        <Confetti isExploding={gameResult} />

        <GameText gameResult={gameResult} shuffleCount={shuffleCount} totalShuffles={totalShuffles} playing={playing} />

        {positions.map((position, index) => (
          <Shell
            key={index}
            index={index}
            hasBall={ballIndex === index}
            lastPosition={lastPositions[index]}
            position={position}
            totalShells={totalShells}
            transparent={transparent}
            duration={duration}
            handleClick={handleShellClick}
            active={index === playerGuess}
          />
        ))}
      </Canvas>

      <div className="buttonPanel">
        {!playing ? <button onClick={playGame}>Play Game</button> : <button onClick={() => window.location.reload()}>Reload</button>}
        <button onClick={toggleCheatMode}>Cheat Mode {transparent ? ' is on ' : 'is off'}</button>
        {!playing && <button onClick={resetBall}>Reset Ball</button>}
      </div>
    </>
  );
};
