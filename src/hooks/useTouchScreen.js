import { useState, useEffect } from 'react';

export const useTouchScreen = () => {
  const [isTouchScreen, setIsTouchScreen] = useState(false);

  useEffect(() => {
    const checkTouchScreen = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchScreen(isTouch);
    };

    checkTouchScreen();

    window.addEventListener('resize', checkTouchScreen);

    return () => {
      window.removeEventListener('resize', checkTouchScreen);
    };
  }, []);

  return isTouchScreen;
};
