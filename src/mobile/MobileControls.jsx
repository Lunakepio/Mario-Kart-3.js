import { Buttons } from "./Buttons"
import { JoystickComponent } from "./JoystickComponent"
import { useTouchScreen } from "../hooks/useTouchScreen";

export const MobileControls = () => {

  const isTouchScreen = useTouchScreen();

  if(!isTouchScreen) return null;
  return(
    <div className="mobile-controls">
      <JoystickComponent />
      <Buttons/>
    </div>
  )
}
