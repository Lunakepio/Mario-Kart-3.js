import * as React from 'react';
import { JoystickShape } from "./enums/shape.enum";
export interface IJoystickProps {
    size?: number;
    stickSize?: number;
    baseColor?: string;
    stickColor?: string;
    throttle?: number;
    disabled?: boolean;
    sticky?: boolean;
    move?: (event: IJoystickUpdateEvent) => void;
    stop?: (event: IJoystickUpdateEvent) => void;
    start?: (event: IJoystickUpdateEvent) => void;
    stickImage?: string;
    baseImage?: string;
    followCursor?: boolean;
    baseShape?: JoystickShape;
    stickShape?: JoystickShape;
    controlPlaneShape?: JoystickShape;
    minDistance?: number;
    pos?: {
        x: number;
        y: number;
    };
}
export interface IJoystickUpdateEvent {
    type: "move" | "stop" | "start";
    x: number | null;
    y: number | null;
    direction: JoystickDirection | null;
    distance: number | null;
}
export interface IJoystickState {
    dragging: boolean;
    coordinates?: IJoystickCoordinates;
}
declare type JoystickDirection = "FORWARD" | "RIGHT" | "LEFT" | "BACKWARD";
export interface IJoystickCoordinates {
    relativeX: number;
    relativeY: number;
    axisX: number;
    axisY: number;
    direction: JoystickDirection;
    distance: number;
}
declare class Joystick extends React.Component<IJoystickProps, IJoystickState> {
    private readonly _stickRef;
    private readonly _baseRef;
    private readonly _throttleMoveCallback;
    private _baseSize;
    private _stickSize?;
    private frameId;
    private _radius;
    private _parentRect;
    private _pointerId;
    private _mounted;
    constructor(props: IJoystickProps);
    componentWillUnmount(): void;
    componentDidMount(): void;
    /**
     * Update position of joystick - set state and trigger DOM manipulation
     * @param coordinates
     * @private
     */
    private _updatePos;
    /**
     * Handle pointerdown event
     * @param e PointerEvent
     * @private
     */
    private _pointerDown;
    /**
     * Use ArcTan2 (4 Quadrant inverse tangent) to identify the direction the joystick is pointing
     * https://docs.oracle.com/cd/B12037_01/olap.101/b10339/x_arcsin003.htm
     * @param atan2: number
     * @private
     */
    private _getDirection;
    /**
     * Hypotenuse distance calculation
     * @param x: number
     * @param y: number
     * @private
     */
    private _distance;
    private _distanceToPercentile;
    /**
     * Calculate X/Y and ArcTan within the bounds of the joystick
     * @param event
     * @private
     */
    private _pointerMove;
    /**
     * Handle pointer up and de-register listen events
     * @private
     */
    private _pointerUp;
    /**
     * Get the shape stylings for the base
     * @private
     */
    private getBaseShapeStyle;
    /**
     * Get the shape stylings for the stick
     * @private
     */
    private getStickShapeStyle;
    /**
     * Calculate base styles for pad
     * @private
     */
    private _getBaseStyle;
    /**
     * Calculate  base styles for joystick and translate
     * @private
     */
    private _getStickStyle;
    render(): JSX.Element;
}
export { Joystick };
