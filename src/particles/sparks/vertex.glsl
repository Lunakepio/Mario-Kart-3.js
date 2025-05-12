uniform float uTime;
uniform bool shouldEmit;

attribute float timeOffset;
attribute float size;
attribute vec3 direction;

varying float vLifetime;
varying vec3 vVelocity;
varying float vLifeRatio;
varying float vShouldShow;

void main() {
    float lifetime = 1.5 + timeOffset;
    
    float timeSinceStart = max(0.0, uTime - timeOffset);
    float age = mod(timeSinceStart, lifetime);
    float lifeRatio = age / lifetime;

    vLifeRatio = lifeRatio;
    if (uTime < timeOffset) {
        gl_PointSize = 0.0;
        gl_Position = vec4(0.0);
        return;
    }

    vShouldShow = (uTime < timeOffset) ? 0.0 : 1.0;

    vec3 newPosition = position + direction * lifeRatio;
    vVelocity = direction * 10.0 / lifetime;
    
    if(!shouldEmit){
      lifeRatio = 0.0;
      age = 0.0;
      timeSinceStart = 0.0;
      newPosition = vec3(0.0);
    }
    float taper = (1.0 - lifeRatio * 7.);
    gl_PointSize = size * clamp(taper, 0.0, 1.0);

    vLifetime = lifeRatio;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
