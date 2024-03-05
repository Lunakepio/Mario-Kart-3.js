import { useState, useEffect, useRef } from 'react';

const GamepadButtons = {
  A: 0,
  B: 1,
  X: 2,
  Y: 3,
  LB: 4,
  RB: 5,
  LT: 6,
  RT: 7,
  start: 8,
  select: 9,
  L3: 10,
  R3: 11,
  up: 12,
  down: 13,
  left: 14,
  right: 15,
  count: 16
}

const GamepadAxes = {
  leftjoy_x: 0,  // Steer left/right
  leftjoy_y: 1,
  rightjoy_x: 2,
  rightjoy_y: 3
}

const defaultGamepadInfo = {
  connected: false,
  buttonA: false,
  buttonB: false,
  buttonX: false,
  buttonY: false,
  joystick: [0, 0],
  joystickRight: [0, 0],
  RB: false,
  LB: false,
  RT: false,
  LT: false,
  start: false,
  select: false,
  up: false,
  down: false,
  left: false,
  right: false
};

const isButtonActive = (activeButtons, button) => Boolean(activeButtons & (1 << button));

export const useGamepad = () => {
  const gamepadInfo = useRef(defaultGamepadInfo);
  const [, forceUpdate] = useState();
  const activeButtonsRef = useRef(0);

  // Function to update gamepad state
  const updateGamepadState = () => {
    const [gamepad] = navigator.getGamepads ? navigator.getGamepads() : []; // Get the first gamepad

    // newly read active button bitmask
    let newActiveButtons = 0;

    if (gamepad) {
      // Buttons
      for (let i = GamepadButtons.A; i < gamepad.buttons.length; i++) {
        // Set the bit for the button if it's pressed
        newActiveButtons |= (gamepad.buttons[i].pressed << i);
      }

      const hasJoysticksMoved = 
        gamepad.axes[GamepadAxes.leftjoy_x] !== gamepadInfo.current.joystick[0] || 
        gamepad.axes[GamepadAxes.leftjoy_y] !== gamepadInfo.current.joystick[1] || 
        gamepad.axes[GamepadAxes.rightjoy_x] !== gamepadInfo.current.joystickRight[0] || 
        gamepad.axes[GamepadAxes.rightjoy_y] !== gamepadInfo.current.joystickRight[1];

      // Update state only if there's a button change or joystick change
      if (newActiveButtons !== activeButtonsRef.current || hasJoysticksMoved) {
        // Update gamepad info for the current gamepad
        gamepadInfo.current = {
          connected: true,
          buttonA: isButtonActive(newActiveButtons, GamepadButtons.A),
          buttonB: isButtonActive(newActiveButtons, GamepadButtons.B),
          buttonX: isButtonActive(newActiveButtons, GamepadButtons.X),
          buttonY: isButtonActive(newActiveButtons, GamepadButtons.Y),
          LB: isButtonActive(newActiveButtons, GamepadButtons.LB),
          RB: isButtonActive(newActiveButtons, GamepadButtons.RB),
          LT: isButtonActive(newActiveButtons, GamepadButtons.LT),
          RT: isButtonActive(newActiveButtons, GamepadButtons.RT),
          L3: isButtonActive(newActiveButtons, GamepadButtons.L3),
          R3: isButtonActive(newActiveButtons, GamepadButtons.R3),
          start: isButtonActive(newActiveButtons, GamepadButtons.start),
          select: isButtonActive(newActiveButtons, GamepadButtons.select),
          up: isButtonActive(newActiveButtons, GamepadButtons.up),
          down: isButtonActive(newActiveButtons, GamepadButtons.down),
          left: isButtonActive(newActiveButtons, GamepadButtons.left),
          right: isButtonActive(newActiveButtons, GamepadButtons.right),
          joystick: [gamepad.axes[0], gamepad.axes[1]],
          joystickRight: [gamepad.axes[2], gamepad.axes[3]]
        };

        // Update the active buttons ref for the next iteration
        activeButtonsRef.current = newActiveButtons;

        // useGamepad will only cause re-render when a value is changed
        forceUpdate({});
      }
    } else {
      // If the gamepad has disconnected, reset the gamepad info
      if (gamepadInfo.connected) {
        gamepadInfo.current = defaultGamepadInfo;
        forceUpdate({});
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
      gamepadInfo.current = defaultGamepadInfo;
    };

    window.addEventListener('gamepadconnected', gamepadConnected);
    window.addEventListener('gamepaddisconnected', gamepadDisconnected);

    // Read gamepad state every frame
    const interval = setInterval(updateGamepadState, 1000 / 60);

    return () => {
      window.removeEventListener('gamepadconnected', gamepadConnected);
      window.removeEventListener('gamepaddisconnected', gamepadDisconnected);
      clearInterval(interval);
    };
  }, []);

  return gamepadInfo.current;
};
