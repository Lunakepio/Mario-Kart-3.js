import { Buttons } from "./Buttons"
import { JoystickComponent } from "./JoystickComponent"
import { useTouchScreen } from "../hooks/useTouchScreen";
import { useGameStore } from "../store";

export const MobileControls = () => {

  const isTouchScreen = useTouchScreen();
  const gamepad = useGameStore((state) => state.gamepad);

  if(!isTouchScreen || gamepad) return null;
  return(
    <div className="mobile-controls">
      <JoystickComponent />
      <Buttons/>
    </div>
  )
}
