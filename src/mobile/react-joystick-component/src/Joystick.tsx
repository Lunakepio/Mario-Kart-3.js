import * as React from 'react';
import {JoystickShape} from "./enums/shape.enum";
import {shapeFactory} from "./shapes/shape.factory";
import {shapeBoundsFactory} from "./shapes/shape.bounds.factory";

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
    pos?: {x: number, y: number};
}


enum InteractionEvents {
    PointerDown = "pointerdown",
    PointerMove = "pointermove",
    PointerUp = "pointerup"
}

export interface IJoystickUpdateEvent {
    type: "move" | "stop" | "start";
    // TODO: these could just be optional, but this may be a breaking change
    x: number | null;
    y: number | null;
    direction: JoystickDirection | null;
    distance: number | null;
}

export interface IJoystickState {
    dragging: boolean;
    coordinates?: IJoystickCoordinates;
}

type JoystickDirection = "FORWARD" | "RIGHT" | "LEFT" | "BACKWARD";

export interface IJoystickCoordinates {
    relativeX: number;
    relativeY: number;
    axisX: number;
    axisY: number;
    direction: JoystickDirection;
    distance: number;
}


/**
 * Radians identifying the direction of the joystick
 */
enum RadianQuadrantBinding {
    TopRight = 2.35619449,
    TopLeft = -2.35619449,
    BottomRight = 0.785398163,
    BottomLeft = -0.785398163
}

class Joystick extends React.Component<IJoystickProps, IJoystickState> {
    private readonly _stickRef: React.RefObject<HTMLButtonElement> = React.createRef();
    private readonly _baseRef: React.RefObject<HTMLDivElement> = React.createRef();
    private readonly _throttleMoveCallback: (data: IJoystickUpdateEvent) => void;
    private _baseSize: number;
    private _stickSize?: number;
    private frameId: number | null = null;

    private _radius: number;
    private _parentRect: DOMRect;
    private _pointerId: number|null = null
    private _mounted = false;

    constructor(props: IJoystickProps) {
        super(props);
        this.state = {
            dragging: false
        };
        this._throttleMoveCallback = (() => {
            let lastCall = 0;
            return (event: IJoystickUpdateEvent) => {

                const now = new Date().getTime();
                const throttleAmount = this.props.throttle || 0;
                if (now - lastCall < throttleAmount) {
                    return;
                }
                lastCall = now;
                if (this.props.move) {
                    return this.props.move(event);
                }
            };
        })();



    }

    componentWillUnmount() {
        this._mounted = false;
        if (this.props.followCursor) {
            window.removeEventListener(InteractionEvents.PointerMove, event => this._pointerMove(event));
        }
        if (this.frameId !== null) {
            window.cancelAnimationFrame(this.frameId);
        }
    }

    componentDidMount() {
        this._mounted = true;
        if (this.props.followCursor) {
            //@ts-ignore
            this._parentRect = this._baseRef.current.getBoundingClientRect();

            this.setState({
                dragging: true
            });

            window.addEventListener(InteractionEvents.PointerMove, event => this._pointerMove(event));

            if (this.props.start) {
                this.props.start({
                    type: "start",
                    x: null,
                    y: null,
                    distance: null,
                    direction: null
                });
            }

        }
    }

    /**
     * Update position of joystick - set state and trigger DOM manipulation
     * @param coordinates
     * @private
     */
    private _updatePos(coordinates: IJoystickCoordinates) {

        this.frameId = window.requestAnimationFrame(() => {
            if(this._mounted){
                this.setState({
                    coordinates,
                });
            }
          });
          
        if(typeof this.props.minDistance ===  'number'){
            if(coordinates.distance < this.props.minDistance){
                return;
            }
        }
        this._throttleMoveCallback({
            type: "move",
            x: ((coordinates.relativeX * 2) / this._baseSize),
            y: -((coordinates.relativeY * 2) / this._baseSize),
            direction: coordinates.direction,
            distance: coordinates.distance
        });

    }

    /**
     * Handle pointerdown event
     * @param e PointerEvent
     * @private
     */
    private _pointerDown(e: PointerEvent) {
        if (this.props.disabled || this.props.followCursor) {
            return;
        }
        //@ts-ignore
        this._parentRect = this._baseRef.current.getBoundingClientRect();

        this.setState({
            dragging: true
        });

        window.addEventListener(InteractionEvents.PointerUp, this._pointerUp);
        window.addEventListener(InteractionEvents.PointerMove, this._pointerMove);
        this._pointerId = e.pointerId
        //@ts-ignore
        this._stickRef.current.setPointerCapture(e.pointerId);

        if (this.props.start) {
            this.props.start({
                type: "start",
                x: null,
                y: null,
                distance: null,
                direction: null
            });
        }

    }

    /**
     * Use ArcTan2 (4 Quadrant inverse tangent) to identify the direction the joystick is pointing
     * https://docs.oracle.com/cd/B12037_01/olap.101/b10339/x_arcsin003.htm
     * @param atan2: number
     * @private
     */
    private _getDirection(atan2: number): JoystickDirection {
        if (atan2 > RadianQuadrantBinding.TopRight || atan2 < RadianQuadrantBinding.TopLeft) {
            return "FORWARD";
        } else if (atan2 < RadianQuadrantBinding.TopRight && atan2 > RadianQuadrantBinding.BottomRight) {
            return "RIGHT"
        } else if (atan2 < RadianQuadrantBinding.BottomLeft) {
            return "LEFT";
        }
        return "BACKWARD";


    }

    /**
     * Hypotenuse distance calculation
     * @param x: number
     * @param y: number
     * @private
     */
    private _distance(x: number, y: number): number {
        return Math.hypot(x, y);
    }
    private _distanceToPercentile(distance:number): number {
        const percentageBaseSize = distance / (this._baseSize/2) * 100;
        if(percentageBaseSize > 100){
            return 100;
        }
        return percentageBaseSize;
    }

    /**
     * Calculate X/Y and ArcTan within the bounds of the joystick
     * @param event
     * @private
     */
    private _pointerMove = (event: PointerEvent) => {
        event.preventDefault()
        if (this.state.dragging) {
            if(!this.props.followCursor && event.pointerId !== this._pointerId) return;
            const absoluteX = event.clientX;
            const absoluteY = event.clientY;
            let relativeX = absoluteX - this._parentRect.left - this._radius;
            let relativeY = absoluteY - this._parentRect.top - this._radius;
            const dist = this._distance(relativeX, relativeY);
            // @ts-ignore
            const bounded = shapeBoundsFactory(
                //@ts-ignore
                this.props.controlPlaneShape || this.props.baseShape,
                absoluteX,
                absoluteY,
                relativeX,
                relativeY,
                dist,
                this._radius,
                this._baseSize,
                this._parentRect);
            relativeX = bounded.relativeX
            relativeY = bounded.relativeY
            const atan2 = Math.atan2(relativeX, relativeY);

            this._updatePos({
                relativeX,
                relativeY,
                distance: this._distanceToPercentile(dist),
                direction: this._getDirection(atan2),
                axisX: absoluteX - this._parentRect.left,
                axisY: absoluteY - this._parentRect.top
            });
        }
    }



    /**
     * Handle pointer up and de-register listen events
     * @private
     */
    private _pointerUp = (event: PointerEvent) => {
        if(event.pointerId !== this._pointerId) return;
        const stateUpdate = {
            dragging: false,
        } as any;
        if (!this.props.sticky) {
            stateUpdate.coordinates = undefined;
        }
        this.frameId = window.requestAnimationFrame(() => {
            if(this._mounted){
                this.setState(stateUpdate);
            }
          });
          
        window.removeEventListener(InteractionEvents.PointerUp, this._pointerUp);
        window.removeEventListener(InteractionEvents.PointerMove, this._pointerMove);
        this._pointerId = null;
        if (this.props.stop) {
            this.props.stop({
                type: "stop",
                // @ts-ignore
                x: this.props.sticky ? ((this.state.coordinates.relativeX * 2) / this._baseSize) : null,
                // @ts-ignore
                y: this.props.sticky ? ((this.state.coordinates.relativeY * 2) / this._baseSize): null,
                // @ts-ignore
                direction: this.props.sticky ? this.state.coordinates.direction : null,
                // @ts-ignore
                distance: this.props.sticky ? this.state.coordinates.distance : null

            });
        }

    }

    /**
     * Get the shape stylings for the base
     * @private
     */
    private getBaseShapeStyle() {
        const shape = this.props.baseShape || JoystickShape.Circle;
        return shapeFactory(shape, this._baseSize);
    }
    /**
     * Get the shape stylings for the stick
     * @private
     */
    private getStickShapeStyle() {
        const shape = this.props.stickShape || JoystickShape.Circle;
        return shapeFactory(shape, this._baseSize);
    }
    /**
     * Calculate base styles for pad
     * @private
     */
    private _getBaseStyle(): any {
        const baseColor: string = this.props.baseColor !== undefined ? this.props.baseColor : "#000033";

        const baseSizeString = `${this._baseSize}px`;
        const padStyle = {
            ...this.getBaseShapeStyle(),
            height: baseSizeString,
            width: baseSizeString,
            background: baseColor,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        } as any;
        if (this.props.baseImage) {
            padStyle.background = `url(${this.props.baseImage})`;
            padStyle.backgroundSize = '100%'
        }
        return padStyle;

    }

    /**
     * Calculate  base styles for joystick and translate
     * @private
     */
    private _getStickStyle(): any {
        const stickColor: string = this.props.stickColor !== undefined ? this.props.stickColor : "#3D59AB";
        const stickSize = this._stickSize ? `${this._stickSize}px` :`${this._baseSize / 1.5}px`;

        let stickStyle = {
            ...this.getStickShapeStyle(),
            background: stickColor,
            cursor: "move",
            height: stickSize,
            width: stickSize,
            border: 'none',
            flexShrink: 0,
            touchAction: 'none',
            backgroundImage:
            "repeating-radial-gradient(circle at center, rgba(255,255,255,0.25), rgba(177, 177, 177, 0.1) 3px, transparent 6px)",
        } as any;
        if (this.props.stickImage) {
            stickStyle.background = `url(${this.props.stickImage})`;
            stickStyle.backgroundSize = '100%'
        }
        if(this.props.pos){
            stickStyle = Object.assign({}, stickStyle, {
                position: 'absolute',
                transform: `translate3d(${(this.props.pos.x * this._baseSize)/2 }px, ${-(this.props.pos.y * this._baseSize)/2}px, 0)`
            });
        }

        if (this.state.coordinates !== undefined) {
            stickStyle = Object.assign({}, stickStyle, {
                position: 'absolute',
                transform: `translate3d(${this.state.coordinates.relativeX}px, ${this.state.coordinates.relativeY}px, 0)`
            });
        }
        return stickStyle;

    }

    render() {
        this._baseSize = this.props.size || 100;
        this._stickSize = this.props.stickSize;
        this._radius = this._baseSize / 2;
        const baseStyle = this._getBaseStyle();
        const stickStyle = this._getStickStyle();
        //@ts-ignore
        return (
            <div data-testid="joystick-base" className={'joystick-base'}

                 ref={this._baseRef}
                 style={baseStyle}>
                <button ref={this._stickRef}
                        disabled={this.props.disabled}
                        onPointerDown={(event: any) => this._pointerDown(event)}
                        className={this.props.disabled ? 'joystick-disabled' : 'test'}
                        style={stickStyle}/>
            </div>
        )
    }
}

export {
    Joystick
};
