uniform float time;
uniform vec3 color;
uniform float opacity;
varying vec2 vUv;
varying vec3 vPosition;

 vec2 hash( vec2 p )
{
  p = vec2( dot(p,vec2(127.1,311.7)),
      dot(p,vec2(269.5,183.3)) );
  return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec2 p )
  {
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;
    
    vec2 i = floor( p + (p.x+p.y)*K1 );
    
    vec2 a = p - i + (i.x+i.y)*K2;
    vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0*K2;
    
    vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
    
    vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
    
    return dot( n, vec3(70.0) );
  }
  

float triangleWave(float x) {
return abs(fract(x) - 0.5) * 2.0;
}

void main() {
  float displacedRadius = length(vPosition.xy);

    vec2 center = vec2(0.5);
  vec2 uv = vUv;

  vec2 diff = uv - center;
  float radius = length(diff);
  float innerThreshold = 0.1;
  float outerThreshold = 0.4; 

  float edgeFactor = smoothstep(innerThreshold, outerThreshold, radius);
  float fade = (color. r > 0.5 && color.g > 0.5) ? 0.01 : 1.0;

  vec3 finalColor = mix(vec3(1.0), color * 10., edgeFactor);


  gl_FragColor = vec4(finalColor, opacity * fade);
}