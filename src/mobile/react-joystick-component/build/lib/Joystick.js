"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Joystick = void 0;
var React = require("react");
var shape_enum_1 = require("./enums/shape.enum");
var shape_factory_1 = require("./shapes/shape.factory");
var shape_bounds_factory_1 = require("./shapes/shape.bounds.factory");
var InteractionEvents;
(function (InteractionEvents) {
    InteractionEvents["PointerDown"] = "pointerdown";
    InteractionEvents["PointerMove"] = "pointermove";
    InteractionEvents["PointerUp"] = "pointerup";
})(InteractionEvents || (InteractionEvents = {}));
/**
 * Radians identifying the direction of the joystick
 */
var RadianQuadrantBinding;
(function (RadianQuadrantBinding) {
    RadianQuadrantBinding[RadianQuadrantBinding["TopRight"] = 2.35619449] = "TopRight";
    RadianQuadrantBinding[RadianQuadrantBinding["TopLeft"] = -2.35619449] = "TopLeft";
    RadianQuadrantBinding[RadianQuadrantBinding["BottomRight"] = 0.785398163] = "BottomRight";
    RadianQuadrantBinding[RadianQuadrantBinding["BottomLeft"] = -0.785398163] = "BottomLeft";
})(RadianQuadrantBinding || (RadianQuadrantBinding = {}));
var Joystick = /** @class */ (function (_super) {
    __extends(Joystick, _super);
    function Joystick(props) {
        var _this = _super.call(this, props) || this;
        _this._stickRef = React.createRef();
        _this._baseRef = React.createRef();
        _this.frameId = null;
        _this._pointerId = null;
        _this._mounted = false;
        /**
         * Calculate X/Y and ArcTan within the bounds of the joystick
         * @param event
         * @private
         */
        _this._pointerMove = function (event) {
            event.preventDefault();
            if (_this.state.dragging) {
                if (!_this.props.followCursor && event.pointerId !== _this._pointerId)
                    return;
                var absoluteX = event.clientX;
                var absoluteY = event.clientY;
                var relativeX = absoluteX - _this._parentRect.left - _this._radius;
                var relativeY = absoluteY - _this._parentRect.top - _this._radius;
                var dist = _this._distance(relativeX, relativeY);
                // @ts-ignore
                var bounded = (0, shape_bounds_factory_1.shapeBoundsFactory)(
                //@ts-ignore
                _this.props.controlPlaneShape || _this.props.baseShape, absoluteX, absoluteY, relativeX, relativeY, dist, _this._radius, _this._baseSize, _this._parentRect);
                relativeX = bounded.relativeX;
                relativeY = bounded.relativeY;
                var atan2 = Math.atan2(relativeX, relativeY);
                _this._updatePos({
                    relativeX: relativeX,
                    relativeY: relativeY,
                    distance: _this._distanceToPercentile(dist),
                    direction: _this._getDirection(atan2),
                    axisX: absoluteX - _this._parentRect.left,
                    axisY: absoluteY - _this._parentRect.top
                });
            }
        };
        /**
         * Handle pointer up and de-register listen events
         * @private
         */
        _this._pointerUp = function (event) {
            if (event.pointerId !== _this._pointerId)
                return;
            var stateUpdate = {
                dragging: false,
            };
            if (!_this.props.sticky) {
                stateUpdate.coordinates = undefined;
            }
            _this.frameId = window.requestAnimationFrame(function () {
                if (_this._mounted) {
                    _this.setState(stateUpdate);
                }
            });
            window.removeEventListener(InteractionEvents.PointerUp, _this._pointerUp);
            window.removeEventListener(InteractionEvents.PointerMove, _this._pointerMove);
            _this._pointerId = null;
            if (_this.props.stop) {
                _this.props.stop({
                    type: "stop",
                    // @ts-ignore
                    x: _this.props.sticky ? ((_this.state.coordinates.relativeX * 2) / _this._baseSize) : null,
                    // @ts-ignore
                    y: _this.props.sticky ? ((_this.state.coordinates.relativeY * 2) / _this._baseSize) : null,
                    // @ts-ignore
                    direction: _this.props.sticky ? _this.state.coordinates.direction : null,
                    // @ts-ignore
                    distance: _this.props.sticky ? _this.state.coordinates.distance : null
                });
            }
        };
        _this.state = {
            dragging: false
        };
        _this._throttleMoveCallback = (function () {
            var lastCall = 0;
            return function (event) {
                var now = new Date().getTime();
                var throttleAmount = _this.props.throttle || 0;
                if (now - lastCall < throttleAmount) {
                    return;
                }
                lastCall = now;
                if (_this.props.move) {
                    return _this.props.move(event);
                }
            };
        })();
        return _this;
    }
    Joystick.prototype.componentWillUnmount = function () {
        var _this = this;
        this._mounted = false;
        if (this.props.followCursor) {
            window.removeEventListener(InteractionEvents.PointerMove, function (event) { return _this._pointerMove(event); });
        }
        if (this.frameId !== null) {
            window.cancelAnimationFrame(this.frameId);
        }
    };
    Joystick.prototype.componentDidMount = function () {
        var _this = this;
        this._mounted = true;
        if (this.props.followCursor) {
            //@ts-ignore
            this._parentRect = this._baseRef.current.getBoundingClientRect();
            this.setState({
                dragging: true
            });
            window.addEventListener(InteractionEvents.PointerMove, function (event) { return _this._pointerMove(event); });
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
    };
    /**
     * Update position of joystick - set state and trigger DOM manipulation
     * @param coordinates
     * @private
     */
    Joystick.prototype._updatePos = function (coordinates) {
        var _this = this;
        this.frameId = window.requestAnimationFrame(function () {
            if (_this._mounted) {
                _this.setState({
                    coordinates: coordinates,
                });
            }
        });
        if (typeof this.props.minDistance === 'number') {
            if (coordinates.distance < this.props.minDistance) {
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
    };
    /**
     * Handle pointerdown event
     * @param e PointerEvent
     * @private
     */
    Joystick.prototype._pointerDown = function (e) {
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
        this._pointerId = e.pointerId;
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
    };
    /**
     * Use ArcTan2 (4 Quadrant inverse tangent) to identify the direction the joystick is pointing
     * https://docs.oracle.com/cd/B12037_01/olap.101/b10339/x_arcsin003.htm
     * @param atan2: number
     * @private
     */
    Joystick.prototype._getDirection = function (atan2) {
        if (atan2 > RadianQuadrantBinding.TopRight || atan2 < RadianQuadrantBinding.TopLeft) {
            return "FORWARD";
        }
        else if (atan2 < RadianQuadrantBinding.TopRight && atan2 > RadianQuadrantBinding.BottomRight) {
            return "RIGHT";
        }
        else if (atan2 < RadianQuadrantBinding.BottomLeft) {
            return "LEFT";
        }
        return "BACKWARD";
    };
    /**
     * Hypotenuse distance calculation
     * @param x: number
     * @param y: number
     * @private
     */
    Joystick.prototype._distance = function (x, y) {
        return Math.hypot(x, y);
    };
    Joystick.prototype._distanceToPercentile = function (distance) {
        var percentageBaseSize = distance / (this._baseSize / 2) * 100;
        if (percentageBaseSize > 100) {
            return 100;
        }
        return percentageBaseSize;
    };
    /**
     * Get the shape stylings for the base
     * @private
     */
    Joystick.prototype.getBaseShapeStyle = function () {
        var shape = this.props.baseShape || shape_enum_1.JoystickShape.Circle;
        return (0, shape_factory_1.shapeFactory)(shape, this._baseSize);
    };
    /**
     * Get the shape stylings for the stick
     * @private
     */
    Joystick.prototype.getStickShapeStyle = function () {
        var shape = this.props.stickShape || shape_enum_1.JoystickShape.Circle;
        return (0, shape_factory_1.shapeFactory)(shape, this._baseSize);
    };
    /**
     * Calculate base styles for pad
     * @private
     */
    Joystick.prototype._getBaseStyle = function () {
        var baseColor = this.props.baseColor !== undefined ? this.props.baseColor : "#000033";
        var baseSizeString = "".concat(this._baseSize, "px");
        var padStyle = __assign(__assign({}, this.getBaseShapeStyle()), { height: baseSizeString, width: baseSizeString, background: baseColor, display: 'flex', justifyContent: 'center', alignItems: 'center' });
        if (this.props.baseImage) {
            padStyle.background = "url(".concat(this.props.baseImage, ")");
            padStyle.backgroundSize = '100%';
        }
        return padStyle;
    };
    /**
     * Calculate  base styles for joystick and translate
     * @private
     */
    Joystick.prototype._getStickStyle = function () {
        var stickColor = this.props.stickColor !== undefined ? this.props.stickColor : "#3D59AB";
        var stickSize = this._stickSize ? "".concat(this._stickSize, "px") : "".concat(this._baseSize / 1.5, "px");
        var stickStyle = __assign(__assign({}, this.getStickShapeStyle()), { background: stickColor, cursor: "move", height: stickSize, width: stickSize, border: 'none', flexShrink: 0, touchAction: 'none' });
        if (this.props.stickImage) {
            stickStyle.background = "url(".concat(this.props.stickImage, ")");
            stickStyle.backgroundSize = '100%';
        }
        if (this.props.pos) {
            stickStyle = Object.assign({}, stickStyle, {
                position: 'absolute',
                transform: "translate3d(".concat((this.props.pos.x * this._baseSize) / 2, "px, ").concat(-(this.props.pos.y * this._baseSize) / 2, "px, 0)")
            });
        }
        if (this.state.coordinates !== undefined) {
            stickStyle = Object.assign({}, stickStyle, {
                position: 'absolute',
                transform: "translate3d(".concat(this.state.coordinates.relativeX, "px, ").concat(this.state.coordinates.relativeY, "px, 0)")
            });
        }
        return stickStyle;
    };
    Joystick.prototype.render = function () {
        var _this = this;
        this._baseSize = this.props.size || 100;
        this._stickSize = this.props.stickSize;
        this._radius = this._baseSize / 2;
        var baseStyle = this._getBaseStyle();
        var stickStyle = this._getStickStyle();
        //@ts-ignore
        return (React.createElement("div", { "data-testid": "joystick-base", className: this.props.disabled ? 'joystick-base-disabled' : '', ref: this._baseRef, style: baseStyle },
            React.createElement("button", { ref: this._stickRef, disabled: this.props.disabled, onPointerDown: function (event) { return _this._pointerDown(event); }, className: this.props.disabled ? 'joystick-disabled' : '', style: stickStyle })));
    };
    return Joystick;
}(React.Component));
exports.Joystick = Joystick;
//# sourceMappingURL=Joystick.js.map