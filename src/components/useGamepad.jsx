import { useState, useEffect } from 'react';

export const useGamepad = () => {
  const [gamepadInfo, setGamepadInfo] = useState({ connected: false, buttonA: false, joystick: [0, 0], RB: false });

  // Function to update gamepad state
  const updateGamepadState = () => {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gamepad = gamepads[0]; // Assuming the first gamepad

    if (gamepad) {
      const newGamepadInfo = {
        connected: true,
        buttonA: gamepad.buttons[0].pressed,
        RB: gamepad.buttons[5].pressed,
        joystick: [gamepad.axes[0], gamepad.axes[1]]
      };

      // Update state only if there's a change
      if (JSON.stringify(newGamepadInfo) !== JSON.stringify(gamepadInfo)) {
        setGamepadInfo(newGamepadInfo);
      }
    } else {
      if (gamepadInfo.connected) {
        setGamepadInfo({ connected: false, buttonA: false, joystick: [0, 0], RB: false });
      }
    }
  };

  useEffect(() => {
    const gamepadConnected = () => {
      console.log('Gamepad connected!');
      updateGamepadState();
    };

    const gamepadDisconnected = () => {
      console.log('Gamepad disconnected!');
      setGamepadInfo({ connected: false, buttonA: false, joystick: [0, 0], RB: false });
    };

    window.addEventListener('gamepadconnected', gamepadConnected);
    window.addEventListener('gamepaddisconnected', gamepadDisconnected);

    // Polling the gamepad state
    const interval = setInterval(updateGamepadState, 100);

    return () => {
      window.removeEventListener('gamepadconnected', gamepadConnected);
      window.removeEventListener('gamepaddisconnected', gamepadDisconnected);
      clearInterval(interval);
    };
  }, [gamepadInfo]);

  return gamepadInfo;
};
