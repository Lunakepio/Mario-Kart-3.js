"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shapeBoundsFactory = void 0;
var shape_enum_1 = require("../enums/shape.enum");
var shapeBoundsFactory = function (shape, absoluteX, absoluteY, relativeX, relativeY, dist, radius, baseSize, parentRect) {
    switch (shape) {
        case shape_enum_1.JoystickShape.Square:
            relativeX = getWithinBounds(absoluteX - parentRect.left - (baseSize / 2), baseSize);
            relativeY = getWithinBounds(absoluteY - parentRect.top - (baseSize / 2), baseSize);
            return { relativeX: relativeX, relativeY: relativeY };
        case shape_enum_1.JoystickShape.AxisX:
            relativeX = getWithinBounds(absoluteX - parentRect.left - (baseSize / 2), baseSize);
            relativeY = 0;
            return { relativeX: relativeX, relativeY: relativeY };
        case shape_enum_1.JoystickShape.AxisY:
            relativeX = 0;
            relativeY = getWithinBounds(absoluteY - parentRect.top - (baseSize / 2), baseSize);
            return { relativeX: relativeX, relativeY: relativeY };
        default:
            if (dist > radius) {
                relativeX *= radius / dist;
                relativeY *= radius / dist;
            }
            return { relativeX: relativeX, relativeY: relativeY };
    }
};
exports.shapeBoundsFactory = shapeBoundsFactory;
var getWithinBounds = function (value, baseSize) {
    var halfBaseSize = baseSize / 2;
    if (value > halfBaseSize) {
        return halfBaseSize;
    }
    if (value < -(halfBaseSize)) {
        return halfBaseSize * -1;
    }
    return value;
};
//# sourceMappingURL=shape.bounds.factory.js.map