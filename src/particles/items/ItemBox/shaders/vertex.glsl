// vertex.glsl

#ifdef USE_INSTANCING_INDIRECT
  #include <instanced_pars_vertex>
#endif
varying vec3 vNormalView;
varying vec3 vPositionView;
varying vec2 vUv;
varying vec3 vPosition;
uniform float time;
void main() {
  #ifdef USE_INSTANCING_INDIRECT
    #include <instanced_vertex>
  #endif

    vUv = uv;
    vNormalView = normalize((modelViewMatrix * vec4(normal, 0.0)).xyz);
    vPositionView = (modelViewMatrix * instanceMatrix * vec4(position, 1.0)).xyz;
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    


    gl_Position = projectionMatrix * vec4(vPositionView, 1.0);
}
