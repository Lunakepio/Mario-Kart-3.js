export const easings = `
#define PI 3.1415926535897932384626433832795
// Linear
float easeLinear(float t) 
{

    return t;
    
}

// --------- Power1 ---------
float easeInPower1(float t) {
    return t;
}

float easeOutPower1(float t) {
    return 1.0 - (1.0 - t);
}

float easeInOutPower1(float t) {
    return t;
}

// --------- Power2 ---------
float easeInPower2(float t) {
    return t * t;
}

float easeOutPower2(float t) {
    return 1.0 - pow(1.0 - t, 2.0);
}

float easeInOutPower2(float t) {
    return t < 0.5
        ? 2.0 * t * t
        : 1.0 - pow(-2.0 * t + 2.0, 2.0) / 2.0;
}

// --------- Power3 ---------
float easeInPower3(float t) {
    return t * t * t;
}

float easeOutPower3(float t) {
    return 1.0 - pow(1.0 - t, 3.0);
}

float easeInOutPower3(float t) {
    return t < 0.5
        ? 4.0 * t * t * t
        : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}

// --------- Power4 ---------
float easeInPower4(float t) {
    return t * t * t * t;
}

float easeOutPower4(float t) {
    return 1.0 - pow(1.0 - t, 4.0);
}

float easeInOutPower4(float t) {
    return t < 0.5
        ? 8.0 * t * t * t * t
        : 1.0 - pow(-2.0 * t + 2.0, 4.0) / 2.0;
}

// Quad
float easeInQuad(float t) {
    return t * t;
}

float easeOutQuad(float t) {
    return t * (2.0 - t);
}

float easeInOutQuad(float t) {
    return t < 0.5 
        ? 2.0 * t * t 
        : -1.0 + (4.0 - 2.0 * t) * t;
}

// Cubic
float easeInCubic(float t) {
    return t * t * t;
}

float easeOutCubic(float t) {
    float t1 = t - 1.0;
    return 1.0 + t1 * t1 * t1;
}

float easeInOutCubic(float t) {
    return t < 0.5
        ? 4.0 * t * t * t
        : (t - 1.0) * (2.0 * t - 2.0) * (2.0 * t - 2.0) + 1.0;
}

// Quart
float easeInQuart(float t) {
    return t * t * t * t;
}

float easeOutQuart(float t) {
    float t1 = t - 1.0;
    return 1.0 - t1 * t1 * t1 * t1;
}

float easeInOutQuart(float t) {
    float t1 = t - 1.0;
    return t < 0.5
        ? 8.0 * t * t * t * t
        : 1.0 - 8.0 * t1 * t1 * t1 * t1;
}

// Quint
float easeInQuint(float t) {
    return t * t * t * t * t;
}

float easeOutQuint(float t) {
    float t1 = t - 1.0;
    return 1.0 + t1 * t1 * t1 * t1 * t1;
}

float easeInOutQuint(float t) {
    float t1 = t - 1.0;
    return t < 0.5
        ? 16.0 * t * t * t * t * t
        : 1.0 + 16.0 * t1 * t1 * t1 * t1 * t1;
}

// Sine
float easeInSine(float t) {
    return -1.0 * cos(t * PI * 0.5) + 1.0;
}

float easeOutSine(float t) {
    return sin(t * PI * 0.5);
}

float easeInOutSine(float t) {
    return -0.5 * (cos(PI * t) - 1.0);
}

// Expo
float easeInExpo(float t) {
    return t == 0.0 ? 0.0 : pow(2.0, 10.0 * (t - 1.0));
}

float easeOutExpo(float t) {
    return t == 1.0 ? 1.0 : 1.0 - pow(2.0, -10.0 * t);
}

float easeInOutExpo(float t) {
    if (t == 0.0 || t == 1.0) return t;
    
    return t < 0.5
        ? 0.5 * pow(2.0, (20.0 * t) - 10.0)
        : 0.5 * (-pow(2.0, (-20.0 * t) + 10.0) + 2.0);
}

// Circ
float easeInCirc(float t) {
    return -1.0 * (sqrt(1.0 - t * t) - 1.0);
}

float easeOutCirc(float t) {
    float t1 = t - 1.0;
    return sqrt(1.0 - t1 * t1);
}

float easeInOutCirc(float t) {
    float t1 = 2.0 * t;
    float t2 = t1 - 2.0;
    return t < 0.5
        ? -0.5 * (sqrt(1.0 - t1 * t1) - 1.0)
        : 0.5 * (sqrt(1.0 - t2 * t2) + 1.0);
}

// Elastic
float easeInElastic(float t) {
    if (t == 0.0 || t == 1.0) return t;
    return -pow(2.0, 10.0 * (t - 1.0)) * sin((t - 1.075) * (2.0 * PI) / 0.3);
}

float easeOutElastic(float t) {
    if (t == 0.0 || t == 1.0) return t;
    return pow(2.0, -10.0 * t) * sin((t - 0.075) * (2.0 * PI) / 0.3) + 1.0;
}

float easeInOutElastic(float t) {
    if (t < 0.5) {
        return -0.5 * pow(2.0, 20.0 * t - 10.0) * 
               sin((20.0 * t - 11.125) * (2.0 * PI) / 4.5);
    }
    return pow(2.0, -20.0 * t + 10.0) * 
           sin((20.0 * t - 11.125) * (2.0 * PI) / 4.5) * 0.5 + 1.0;
}

// Back
float easeInBack(float t) {
    float s = 1.70158;
    return t * t * ((s + 1.0) * t - s);
}

float easeOutBack(float t) {
    float s = 1.70158;
    float t1 = t - 1.0;
    return t1 * t1 * ((s + 1.0) * t1 + s) + 1.0;
}

float easeInOutBack(float t) {
    float s = 1.70158 * 1.525;
    t *= 2.0;
    if (t < 1.0) {
        return 0.5 * (t * t * ((s + 1.0) * t - s));
    }
    t -= 2.0;
    return 0.5 * (t * t * ((s + 1.0) * t + s) + 2.0);
}

// Bounce
float easeOutBounce(float t) {
    if (t < 1.0 / 2.75) {
        return 7.5625 * t * t;
    } else if (t < 2.0 / 2.75) {
        t -= 1.5 / 2.75;
        return 7.5625 * t * t + 0.75;
    } else if (t < 2.5 / 2.75) {
        t -= 2.25 / 2.75;
        return 7.5625 * t * t + 0.9375;
    } else {
        t -= 2.625 / 2.75;
        return 7.5625 * t * t + 0.984375;
    }
}

float easeInBounce(float t) {
    return 1.0 - easeOutBounce(1.0 - t);
}

float easeInOutBounce(float t) {
    return t < 0.5
        ? (1.0 - easeOutBounce(1.0 - 2.0 * t)) * 0.5
        : (1.0 + easeOutBounce(2.0 * t - 1.0)) * 0.5;
}

float applyEasing(float t, int easingId) {
    if (easingId == 0) return easeLinear(t);
    else if (easingId == 1) return easeInPower1(t);
    else if (easingId == 2) return easeOutPower1(t);
    else if (easingId == 3) return easeInOutPower1(t);
    else if (easingId == 4) return easeInPower2(t);
    else if (easingId == 5) return easeOutPower2(t);
    else if (easingId == 6) return easeInOutPower2(t);
    else if (easingId == 7) return easeInPower3(t);
    else if (easingId == 8) return easeOutPower3(t);
    else if (easingId == 9) return easeInOutPower3(t);
    else if (easingId == 10) return easeInPower4(t);
    else if (easingId == 11) return easeOutPower4(t);
    else if (easingId == 12) return easeInOutPower4(t);
    else if (easingId == 13) return easeInQuad(t);
    else if (easingId == 14) return easeOutQuad(t);
    else if (easingId == 15) return easeInOutQuad(t);
    else if (easingId == 16) return easeInCubic(t);
    else if (easingId == 17) return easeOutCubic(t);
    else if (easingId == 18) return easeInOutCubic(t);
    else if (easingId == 19) return easeInQuart(t);
    else if (easingId == 20) return easeOutQuart(t);
    else if (easingId == 21) return easeInOutQuart(t);
    else if (easingId == 22) return easeInQuint(t);
    else if (easingId == 23) return easeOutQuint(t);
    else if (easingId == 24) return easeInOutQuint(t);
    else if (easingId == 25) return easeInSine(t);
    else if (easingId == 26) return easeOutSine(t);
    else if (easingId == 27) return easeInOutSine(t);
    else if (easingId == 28) return easeInExpo(t);
    else if (easingId == 29) return easeOutExpo(t);
    else if (easingId == 30) return easeInOutExpo(t);
    else if (easingId == 31) return easeInCirc(t);
    else if (easingId == 32) return easeOutCirc(t);
    else if (easingId == 33) return easeInOutCirc(t);
    else if (easingId == 34) return easeInElastic(t);
    else if (easingId == 35) return easeOutElastic(t);
    else if (easingId == 36) return easeInOutElastic(t);
    else if (easingId == 37) return easeInBack(t);
    else if (easingId == 38) return easeOutBack(t);
    else if (easingId == 39) return easeInOutBack(t);
    else if (easingId == 40) return easeInBounce(t);
    else if (easingId == 41) return easeOutBounce(t);
    else if (easingId == 42) return easeInOutBounce(t);
    // fallback
    return t;
}

`;