    precision highp float;
    uniform float time;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float xDisplacement;
    
    #define PI 3.1415926535897932384626433832795
   
      
void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normal;

  float centeredY = vUv.y - 0.5;

  float curvature = 4.;
  float angle = centeredY * PI / curvature;
  float radius = curvature;

  vec3 localPosition = position;
  float newZ = radius - cos(angle) * radius;

  localPosition.z += newZ;

  vec4 modelPosition = modelMatrix * vec4(localPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
}
