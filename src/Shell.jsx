import React, { useState, useRef } from 'react';
import { useSpring, animated } from '@react-spring/three';

export const Shell = ({ index, position, lastPosition, hasBall, transparent, duration, handleClick, active }) => {
  const $mesh = useRef();

  const [selected, setSelected] = useState(false);
  const onSelect = () => {
    setSelected(true);
    handleClick(index);
  };
  const [hover, setHover] = useState(false);
  const { shellColor, shellTransparency } = useSpring({
    shellColor: hover ? 'green' : active ? 'red' : 'blue',
    shellTransparency: transparent ? 0.1 : 1
  });

  const [{ shellPosition, ballPosition }] = useSpring(
    {
      from: {
        // lower shell if just received the ball
        shellPosition: [lastPosition, 0, hasBall ? 2 : 0],
        ballPosition: [lastPosition, 0, 0]
      },
      to: async (next) => {
        if (lastPosition !== position && !selected) {
          const midPosition = [(position + lastPosition) / 2, (position - lastPosition) / 2, 0];
          await next({
            shellPosition: midPosition,
            ballPosition: midPosition
          });
        }
        await next({
          // raise shell on player guess
          shellPosition: [position, 0, selected ? 2 : 0],
          ballPosition: [position, 0, 0]
        });
      },
      config: { mass: 1, tension: 170, friction: 26, duration } // Smoothness of the animation
    },
    [lastPosition, position, selected, hasBall]
  );
  return (
    <>
      <animated.mesh
        ref={$mesh}
        position={shellPosition}
        onClick={onSelect}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        castShadow>
        <sphereGeometry args={[0.7, 32, 32, 0, Math.PI]} />
        <animated.meshPhongMaterial color={shellColor} opacity={shellTransparency} transparent />
      </animated.mesh>
      {hasBall && (
        <animated.mesh position={ballPosition}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color="blue" />
        </animated.mesh>
      )}
    </>
  );
};
