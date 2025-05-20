    uniform float time;
    uniform float timeOffset;
    uniform float level;
    uniform vec3 color;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float xDisplacement;
    
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
      
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;

    vec3 radialDir = normalize(vec3(vPosition.xy + 1e-4, 0.0));
        
    float n = noise(position.xy * 20. + vec2((time + timeOffset * 10.) * 4.0, 0.0));
    
    float edgeFactor = length(vPosition.xy);
    float displacement = abs(n * edgeFactor * (4.0 + level * 0.2));

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