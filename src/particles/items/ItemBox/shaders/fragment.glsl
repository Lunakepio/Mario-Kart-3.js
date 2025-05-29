// Inputs
varying vec2 vUv;
varying vec3 vNormalView;
varying vec3 vPositionView;
uniform sampler2D rainbowTexture;
varying vec3 vPosition;
uniform float time;

float tri(float x) {
    return abs(fract(x) - 0.5) * 2.0;
}

void main() {
    vec3 viewDir = normalize(-vPositionView);
    
    float wave = tri(vPosition.y * 0.2 - time * 0.1);
    vec3 rainbow = texture2D(rainbowTexture, vec2(wave, 0.0)).rgb * 1.;

    vec2 boxUv = mod(vPositionView.xy * 4.0, 1.0); // Same as fract
    float dist = distance(boxUv, vec2(0.5));
    if(dist < 0.3){
        float altWave = tri(vPositionView.y * 0.4 + time * 0.1);
        rainbow = texture2D(rainbowTexture, vec2(altWave, 0.0)).rgb * 1.;
    }

    float fresnelRaw = 1.0 - dot(normalize(vNormalView), viewDir);
    float fresnel = step(0.8, fresnelRaw);

    vec3 fresnelColor = vec3(1.0) * 3.0;
    vec3 finalColor = mix(rainbow, fresnelColor, fresnel);

    gl_FragColor = vec4(finalColor , 1.0);
}