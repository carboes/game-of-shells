import React from 'react';
import { Text3D, Center } from '@react-three/drei';
import { GameWin } from './GameWin';

const font = import('./font.json');

export const GameText = ({ gameResult, shuffleCount, totalShuffles, playing }) => {
  let gameText = '';
  if (gameResult) {
    return <GameWin />;
  } else if (gameResult === false) {
    gameText = 'You lose!';
  } else if (!playing) {
    gameText = 'Game of Shells';
  } else if (shuffleCount === totalShuffles) {
    gameText = 'Choose Shell';
  } else {
    gameText = `Shuffling... ${shuffleCount} / ${totalShuffles}`;
  }

  return (
    <Center position={[0, -2, 0]} rotateX={90}>
      <Text3D castShadow scale={0.5} height={2} font={font} bevelEnabled bevelSize={0.1} anchorX="center" anchorY="middle">
        {gameText}
        <meshNormalMaterial />
      </Text3D>
    </Center>
  );
};
