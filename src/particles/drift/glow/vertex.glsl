    uniform float time;
    uniform float timeOffset;
    uniform float level;
    uniform vec3 color;
    uniform sampler2D noiseTexture;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    uniform float xDisplacement;
    
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;

    vec3 radialDir = normalize(vec3(vPosition.xy + 1e-4, 0.0));
        
    vec2 noiseUV = fract(uv * 4. + vec2(-time * 0.5 , 0.0));
    vec4 n = texture2D(noiseTexture, noiseUV);
    
    float edgeFactor = length(vPosition.xy);
    float displacement = abs(pow(n.r, 2.) * edgeFactor * (4.0 + level * 0.2));

    if (mod(float(gl_VertexID), 2.0) > 0.5 || (color.r > 0.8 && color.g > 0.8)) {
      displacement = 0.0;
    } else {
      vPosition.xy += vec2(xDisplacement * edgeFactor, -(abs(xDisplacement * edgeFactor)));
    }

    float scale = 1.0 + abs(sin(time * 40.)) * 0.3;
    vec3 scaledPosition = vPosition * scale;
    vec3 newPosition = scaledPosition + radialDir * displacement;

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
  }