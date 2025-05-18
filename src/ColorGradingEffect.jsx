import { Effect } from "postprocessing";
import { Uniform, Vector2, Vector3, Euler, Quaternion, Color} from "three";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGameStore } from "./store";
import { lerp } from "three/src/math/MathUtils.js";
import { useControls } from "leva";

const fragmentShader = /* glsl */ `
uniform sampler2D tDiffuse;
uniform float time;

uniform vec2 motionDirection;

uniform vec3 uRedMix;
uniform vec3 uGreenMix;
uniform vec3 uBlueMix;
uniform vec3 uShadowTint;
uniform vec3 uHighlightTint;
uniform float hueAdjust[8];
uniform float satAdjust[8];
uniform float lumAdjust[8];

uniform float uBrightness;
uniform float uContrast;
uniform float uSaturation;
uniform float uVibrancy;
uniform float uHueOffset;
uniform float uGamma;
uniform float uSplitToneBalance;
uniform float motionStrength;
uniform float uExposure;
uniform float uKelvin;

vec2 hash(vec2 p) {
  p = vec2(
    dot(p, vec2(127.1, 311.7)),
    dot(p, vec2(269.5, 183.3))
  );
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

vec3 rgbToHsv(vec3 c) {
    vec4 K = vec4(0., -1./3., 2./3., -1.);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),
                d / (q.x + e),
                q.x);
}

vec3 hsvToRgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

float noise(in vec2 p) {
  const float K1 = 0.366025404;
  const float K2 = 0.211324865;

  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;

  vec3 h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
  vec3 n = h * h * h * h * vec3(
    dot(a, hash(i + 0.0)),
    dot(b, hash(i + o)),
    dot(c, hash(i + 1.0))
  );

  return dot(n, vec3(70.0));
}

vec4 blurMotion(sampler2D tex, vec2 uv, vec2 resolution, vec2 direction, float strength)
{
    vec4 color = vec4(0.0);
    float total = 0.0;

    for ( float i = -5.0; i <= 5.0; i++ )
    {
        float weight = 1.0 - abs(i) / 5.0;
        vec2 offset = direction * ( i * strength ) / resolution;
        color += texture2D(tex, uv + offset) * weight;
        total += weight;
    }

    return color / total;
}

vec3 colorChannelMixer( vec3 inputColor, vec3 redMix, vec3 greenMix, vec3 blueMix, float brightness, float contrast )
{

    mat3 mixMatrix = mat3(
        redMix,
        greenMix,
        blueMix
    );


    vec3 mixedColor = mixMatrix * inputColor;

    mixedColor = max( vec3( 0.0 ), mixedColor * contrast + brightness );

    return mixedColor;

}

vec3 colorContrast( vec3 color, float contrast )
{

    float midPoint = pow( 0.5, 2.2 );

    return ( color - midPoint ) * contrast + midPoint;

}

vec3 colorSaturation( vec3 color, float saturation )
{

    float luminance = dot( color, vec3( 0.299, 0.587, 0.114 ) );

    vec3 grayscale = vec3( luminance );

    return mix( grayscale, color, 1.0 + saturation );

}

vec3 colorHueRadians( vec3 inputColor, float offset )
{

    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 P = mix(vec4(inputColor.bg, K.wz), vec4(inputColor.gb, K.xy), step(inputColor.b, inputColor.g));
    vec4 Q = mix(vec4(P.xyw, inputColor.r), vec4(inputColor.r, P.yzx), step(P.x, inputColor.r));

    float D = Q.x - min(Q.w, Q.y);
    float E = 1e-10;

    vec3 hsv = vec3(
        abs(Q.z + (Q.w - Q.y) / (6.0 * D + E)),
        D / (Q.x + E),
        Q.x
    );

    float hue = hsv.x + offset;

    hsv.x = (hue < 0.0) ? hue + 1.0 : (hue > 1.0) ? hue - 1.0 : hue;

    vec4 K2 = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 P2 = abs(fract(hsv.xxx + K2.xyz) * 6.0 - K2.www);

    return hsv.z * mix(K2.xxx, clamp(P2 - K2.xxx, 0.0, 1.0), hsv.y);
}

vec3 gammaCorrect(vec3 color, float gamma) {
  return pow(clamp(color, 0.0, 1.0), vec3(1.0 / gamma));
}

vec3 colorVibrancy(vec3 color, float vibrancy) {
    float maxVal = max(max(color.r, color.g), color.b);
    float minVal = min(min(color.r, color.g), color.b);
    float sat = maxVal - minVal;

    float vibFactor = smoothstep(0.0, 0.5, sat); // low sat -> more vibrancy
    vibFactor = 1.0 + vibrancy * (1.0 - vibFactor);

    // Convert to perceived grayscale
    float luminance = dot(color, vec3(0.299, 0.587, 0.114));
    vec3 gray = vec3(luminance);

    return mix(gray, color, vibFactor);
}

vec3 splitToning(vec3 color, vec3 shadows, vec3 highlights, float balance) {
  float luminance = dot(color, vec3(0.299, 0.587, 0.114));
  vec3 tone = mix(shadows, highlights, smoothstep(0.0, 1.0, luminance + balance));
  return color * tone;
}

float posterize( float value, float steps )
{

    return floor( value / ( 1.0 / steps ) ) * ( 1.0 / steps );

}

vec3 applyExposure(vec3 color, float exposure) {
    return color * pow(2.0, exposure);
}

vec3 colorTemperature(vec3 color, float kelvin) {
    kelvin = clamp(kelvin, 1000.0, 40000.0) / 100.0;

    float red, green, blue;

    // Red
    if (kelvin <= 66.0) {
        red = 1.0;
    } else {
        red = kelvin - 60.0;
        red = 329.698727446 * pow(red, -0.1332047592) / 255.0;
        red = clamp(red, 0.0, 1.0);
    }

    // Green
    if (kelvin <= 66.0) {
        green = kelvin;
        green = 99.4708025861 * log(green) - 161.1195681661;
        green /= 255.0;
    } else {
        green = kelvin - 60.0;
        green = 288.1221695283 * pow(green, -0.0755148492);
        green /= 255.0;
    }
    green = clamp(green, 0.0, 1.0);

    // Blue
    if (kelvin >= 66.0) {
        blue = 1.0;
    } else if (kelvin <= 19.0) {
        blue = 0.0;
    } else {
        blue = kelvin - 10.0;
        blue = 138.5177312231 * log(blue) - 305.0447927307;
        blue /= 255.0;
        blue = clamp(blue, 0.0, 1.0);
    }

    vec3 tempColor = vec3(red, green, blue);
    return color * tempColor;
}

int getHueRange(float hue) {
    if (hue < 0.04 || hue > 0.96) return 0;        // Red
    else if (hue < 0.10) return 1;                 // Orange
    else if (hue < 0.17) return 2;                 // Yellow
    else if (hue < 0.30) return 3;                 // Green
    else if (hue < 0.45) return 4;                 // Aqua
    else if (hue < 0.60) return 5;                 // Blue
    else if (hue < 0.75) return 6;                 // Purple
    else return 7;                                 // Magenta
}

vec3 applyHslPerRange(vec3 color) {
    vec3 hsv = rgbToHsv(color);
    int range = getHueRange(hsv.x);
    
    // Adjustments
    hsv.x += hueAdjust[range];  // wrap if needed
    hsv.x = mod(hsv.x, 1.0);    // keep in 0-1 range

    hsv.y = clamp(hsv.y + satAdjust[range], 0.0, 1.0);
    hsv.z = clamp(hsv.z + lumAdjust[range], 0.0, 1.0);

    return hsvToRgb(hsv);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 fragColor) {
  vec2 resolution = vec2(${window.innerWidth}., ${window.innerHeight}.);
  vec2 direction = motionDirection * motionStrength;
  vec4 baseColor = texture2D(tDiffuse, uv);
  vec4 blurredColor = blurMotion(tDiffuse, uv, resolution, direction, 12.0);

  vec3 color = blurredColor.rgb;

  color = colorContrast(color, uContrast);
  color = colorSaturation(color, uSaturation);
  color = colorVibrancy(color, uVibrancy);
  color = colorChannelMixer(color, uRedMix, uGreenMix, uBlueMix, uBrightness, 1.0);
  color = colorHueRadians(color, uHueOffset);
  color = gammaCorrect(color, uGamma);
  color = splitToning(color, uShadowTint, uHighlightTint, uSplitToneBalance);
  color = applyExposure(color, uExposure);
  color = colorTemperature(color, uKelvin);
  color = applyHslPerRange(color);
  fragColor = vec4(color, 1.0);
}


`;

export class ColorGradingEffect extends Effect {
  constructor() {
    super("ColorGradingEffect", fragmentShader, {
      uniforms: new Map([
        ["time", new Uniform(0)],
        ["motionDirection", new Uniform(new Vector2(0, 0))],
        ["motionStrength", new Uniform(0)],
        ["uRedMix", new Uniform(new Vector3(1, 0, 0))],
        ["uGreenMix", new Uniform(new Vector3(0, 1, 0))],
        ["uBlueMix", new Uniform(new Vector3(0, 0, 1))],
        ["uSaturation", new Uniform(1)],
        ["uVibrancy", new Uniform(1)],
        ["uBrightness", new Uniform(0)],
        ["uContrast", new Uniform(1)],
        ["uHueOffset", new Uniform(0)],
        ["uGamma", new Uniform(1)],
        ["uShadowTint", new Uniform(new Vector3(1.0, 0.9, 0.9))],
        ["uHighlightTint", new Uniform(new Vector3(0.9, 1.0, 1.0))],
        ["uSplitToneBalance", new Uniform(0.0)],
        ["uExposure", new Uniform(0)],
        ["uKelvin", new Uniform(5500)],
        ["hueAdjust", new Uniform(new Float32Array(8))],
        ["satAdjust", new Uniform(new Float32Array(8))],
        ["lumAdjust", new Uniform(new Float32Array(8))],
      ]),
    });
  }

  updateTime(t) {
    this.uniforms.get("time").value = t;
  }

  updateMotion(dir, strength) {
    this.uniforms.get("motionDirection").value.copy(dir);
    this.uniforms.get("motionStrength").value = strength;
  }

  updateColorMix(
    red,
    green,
    blue,
    brightness,
    contrast,
    saturation,
    vibrancy,
    hueOffset,
    gamma,
    shadowTint,
    highlightTint,
    splitToneBalance,
    exposure,
    kelvin,
  ) {
    this.uniforms.get("uRedMix").value = new Color(red);
    this.uniforms.get("uGreenMix").value = new Color(green);
    this.uniforms.get("uBlueMix").value = new Color(blue);
    this.uniforms.get("uBrightness").value = brightness;
    this.uniforms.get("uContrast").value = contrast;
    this.uniforms.get("uSaturation").value = saturation;
    this.uniforms.get("uVibrancy").value = vibrancy;
    this.uniforms.get("uHueOffset").value = hueOffset;
    this.uniforms.get("uGamma").value = gamma;
    this.uniforms.get("uShadowTint").value = new Color(shadowTint);
    this.uniforms.get("uHighlightTint").value = new Color(highlightTint);
    this.uniforms.get("uSplitToneBalance").value = splitToneBalance;
    this.uniforms.get("uExposure").value = exposure;
    this.uniforms.get("uKelvin").value = kelvin;
  }
  
  setHslAdjustments(hueAdjust, satAdjust, lumAdjust) {
    if (!this.uniforms.has("hueAdjust")) {
      this.uniforms.set("hueAdjust", { value: new Float32Array(8) });
      this.uniforms.set("satAdjust", { value: new Float32Array(8) });
      this.uniforms.set("lumAdjust", { value: new Float32Array(8) });
    }
  
    this.uniforms.get("hueAdjust").value.set(hueAdjust);
    this.uniforms.get("satAdjust").value.set(satAdjust);
    this.uniforms.get("lumAdjust").value.set(lumAdjust);
  }
}
export const ColorGrading = forwardRef((props, ref) => {
  const effect = useMemo(() => new ColorGradingEffect(), []);
  const { camera } = useThree();

  const {
    redMix,
    greenMix,
    blueMix,
    brightness,
    contrast,
    saturation,
    vibrancy,
    hueOffset,
    gamma,
    shadowTint,
    highlightTint,
    splitToneBalance,
    exposure,
    kelvin,
  } = useControls("Color Grading", {
    redMix: { value: "#FF0000", label: "Red Mix" },
    greenMix: {
      value: "#00FF00",
      label: "Green Mix",
    },
    blueMix: {
      value: "#0000FF",
      label: "Blue Mix",
    },
    brightness: { value: 0, min: -1, max: 1, step: 0.001 },
    contrast: { value: 1, min: 0, max: 3, step: 0.001 },
    saturation: { value: 0., min: -1, max: 3, step: 0.001 },
    vibrancy: { value: 0.12, min: -1, max: 3, step: 0.001 },
    hueOffset: { value: 0, min: -Math.PI, max: Math.PI, step: 0.001 },
    gamma: { value: 1, min: 0, max: 3, step: 0.001 },
    shadowTint: { value: "#ffffff", label: "Shadow Tint" },
    highlightTint: { value: "#ffffff", label: "Highlight Tint" },
    splitToneBalance: { value: 0, min: 0, max: 1, step: 0.001 },
    exposure: { value: 0, min: -1, max: 3, step: 0.001 },
    kelvin: { value: 5500, min: 1000, max: 40000 },
  });
  
  const hues = [
    "Red", "Orange", "Yellow", "Green", "Aqua", "Blue", "Purple", "Magenta"
  ];
  
  const hueControls = useControls("Hue Adjustments", () =>
    Object.fromEntries(
      hues.map((hue, i) => [
        `${hue}`,
        {
          value: { hue: 0, sat: 0, lum: 0 },
          step: 0.01,
          min: -1,
          max: 1,
        },
      ])
    )
  );

  const prevQuat = useRef(new Quaternion());
  const prevSpeed = useRef(0);

  useFrame((state, delta) => {
    if (!camera) return;
    
    if (!hueControls) return;
    const hueAdjust = hues.map(h => hueControls[0][h].hue);
    const satAdjust = hues.map(h => hueControls[0][h].sat);
    const lumAdjust = hues.map(h => hueControls[0][h].lum);
    console.log(hueControls[0]);
    effect.updateTime(state.clock.elapsedTime);
    effect.updateColorMix(
      redMix,
      greenMix,
      blueMix,
      brightness,
      contrast,
      saturation,
      vibrancy,
      hueOffset,
      gamma,
      shadowTint,
      highlightTint,
      splitToneBalance,
      exposure,
      kelvin,
    );
    effect.setHslAdjustments(hueAdjust, satAdjust, lumAdjust);

    const speed = useGameStore.getState().speed;
    const normalizedSpeed = Math.abs(prevSpeed.current / 30 - speed / 30);
    prevSpeed.current = lerp(prevSpeed.current, speed, 8 * delta);

    const verticalDir = new Vector2(0.0, normalizedSpeed);
    const verticalStrength = Math.abs(normalizedSpeed) * 0.01;

    const currentQuat = camera.quaternion.clone();
    const deltaQuat = currentQuat
      .clone()
      .multiply(prevQuat.current.clone().invert());
    const deltaEuler = new Euler().setFromQuaternion(deltaQuat);
    const yawChange = deltaEuler.y;

    const horizontalDir = new Vector2(Math.sign(yawChange), 0.0);
    const horizontalStrength = Math.abs(yawChange) * 0.2;

    const combinedDir = new Vector2()
      .addScaledVector(horizontalDir, horizontalStrength)
      .addScaledVector(verticalDir, verticalStrength);

    const combinedStrength = combinedDir.length();
    if (combinedStrength > 0.0) combinedDir.normalize();

    prevQuat.current.copy(currentQuat);
    effect.updateMotion(combinedDir, combinedStrength);
  });

  useEffect(() => {
    if (ref) ref.current = effect;
    if (camera) {
      prevQuat.current.copy(camera.quaternion);
    }
  }, [effect, camera]);

  return <primitive object={effect} />;
});
