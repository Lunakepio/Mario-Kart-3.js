import { JoystickShape } from "../enums/shape.enum";
export declare const shapeBoundsFactory: (shape: JoystickShape, absoluteX: number, absoluteY: number, relativeX: number, relativeY: number, dist: number, radius: number, baseSize: number, parentRect: DOMRect) => {
    relativeX: number;
    relativeY: number;
};
