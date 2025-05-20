 uniform float time;
 uniform float opacity;
 varying vec2 vUv;
 varying vec3 vPosition;
 varying vec3 vNormal;

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

float random(float x) {
return fract(sin(x) * 43758.5453123);
}
 void main() {
   vec3 normal = normalize(vNormal);
   vec3 viewDirection = normalize(cameraPosition - vPosition);
   
   float fresnel = dot(viewDirection, normal);
   fresnel = pow(1.0 - fresnel, 2.5);
   float falloff = smoothstep(0.0, 1.0, fresnel);
   
   vec3 lightColor = vec3(0.937, 0.776, 0.489);
   float luminance = dot(lightColor, vec3(0.299, 0.587, 0.114));
   float desaturationFactor = 0.3;
   lightColor = mix(lightColor, vec3(luminance), desaturationFactor);


   float stripe = smoothstep(0., 0.5, clamp(abs(fract(vUv.y +random(sin(time))) - 0.5), 0.0, 1.0));
   stripe = 1.0 - stripe;


   float n = noise(vec2(vUv.x * 6., time * 4.));
   float flicker = smoothstep(0.2, 0.8, n); 
   float intensity = stripe * flicker;


   float verticalFade = smoothstep(0.1, 0.4, vUv.y);

   vec3 finalColor = lightColor * intensity * verticalFade;

   float alpha = 1.0 - smoothstep(0.0, 0.5, abs(vUv.y - 0.5));

   gl_FragColor = vec4(vec3(1.0) * 3., intensity * alpha * opacity);
 }