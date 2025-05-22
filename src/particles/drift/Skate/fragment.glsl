precision highp float;

uniform float time;
uniform float opacity;
uniform sampler2D noiseTexture;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

float random(float x) {
  return fract(sin(x) * 43758.5453123);
}

void main() {
  float stripe = smoothstep(0.0, 0.1, fract(vUv.x + random(sin(time))));
  stripe = 1.0 - stripe;
  vec2 noiseUV = fract(vUv * 4. + vec2(-time * 0.5 , 0.0));
  vec4 n = texture2D(noiseTexture, noiseUV);

  float yFadeOffset = random(floor(vUv.x * 10.0) + time);
  float verticalDistance = abs(vUv.y - 0.5);
  float verticalFade = 1.0 - smoothstep(0.0, 0.4 + yFadeOffset * clamp(n.r, 0.0, 0.2), verticalDistance); 

  float finalAlpha = stripe * verticalFade * opacity;

  vec3 color = vec3(1.0) * 3.0;
  gl_FragColor = vec4(color, finalAlpha);
}