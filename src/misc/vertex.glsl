    varying vec2 vUv;
    varying vec3 vWorldNormal;
    void main() {
      vWorldNormal = normalize(normalMatrix * normal);
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }