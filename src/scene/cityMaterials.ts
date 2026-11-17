import * as THREE from 'three';

/** Windows are shaded per facade cell, rather than represented by thousands of lamps. */
export function createFacadeMaterial() {
 return new THREE.ShaderMaterial({
  uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.fog,{uTime:{value:0},uTint:{value:new THREE.Vector3(1,1,1)}}]),fog:true,
  vertexShader:`
   varying vec2 vFacade; varying vec3 vNormal; varying vec3 vWorld;
   #include <fog_pars_vertex>
   void main(){
    vec3 dimensions=vec3(length(instanceMatrix[0].xyz),length(instanceMatrix[1].xyz),length(instanceMatrix[2].xyz));
    vFacade=uv*vec2(abs(normal.x)>.5?dimensions.z:dimensions.x,dimensions.y);
    vNormal=normal; vec4 world=modelMatrix*instanceMatrix*vec4(position,1.);
    vWorld=world.xyz;vec4 mvPosition=viewMatrix*world;
    gl_Position=projectionMatrix*mvPosition;
    #include <fog_vertex>
   }`,
  fragmentShader:`
   uniform float uTime;uniform vec3 uTint; varying vec2 vFacade; varying vec3 vNormal; varying vec3 vWorld;
   #include <fog_pars_fragment>
   float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
   void main(){
    vec2 cell=floor(vFacade/vec2(.68,1.25));vec2 f=fract(vFacade/vec2(.68,1.25));
    float building=hash(floor(vWorld.xz*.013));
    float n=hash(cell+floor(vWorld.xz*.01)*37.);
    float facing=.55+.45*abs(vNormal.x);
    vec3 base=mix(vec3(.012,.029,.034),vec3(.027,.047,.052),building)*facing;
    float panel=step(.94,fract(vFacade.x*.2))+step(.975,fract(vFacade.y*.1));
    base+=vec3(.025,.033,.045)*min(panel,1.);
    float mask=smoothstep(.14,.19,f.x)*(1.-smoothstep(.68,.74,f.x))*smoothstep(.2,.24,f.y)*(1.-smoothstep(.68,.74,f.y));
    float district=hash(floor(cell/vec2(5.,9.))+building*71.);
    float lit=step(.55+district*.25,n)*step(.22,hash(vec2(cell.y,building*98.)));
    float curtains=.68+.32*step(.5,fract(f.x*7.));
    vec3 light=mix(vec3(.29,.66,.64),vec3(.78,.67,.44),step(.81,n));
    light=mix(light,vec3(.63,.31,.56),step(.97,n));
    float change=.92+.08*sin(uTime*.22+n*80.);
    float ribs=step(.96,fract(vFacade.x*.8));
    base+=vec3(.012,.017,.023)*ribs;
    float grime=.65+.35*hash(floor(vFacade*vec2(3.,.3)));
    vec3 color=base*grime+light*mask*lit*curtains*change*(.14+n*.44);
    // Local advertising spill catches wet facade edges without extra lights.
    float cyanWash=exp(-length((vWorld-vec3(72.,17.,-26.))*vec3(.1,.035,.055)));
    float pinkWash=exp(-length((vWorld-vec3(83.,9.,35.))*vec3(.1,.035,.055)));
    color+=(vec3(.008,.065,.067)*cyanWash+vec3(.067,.009,.039)*pinkWash)*facing;
    float wash=exp(-abs(vWorld.y-8.)*.022);
    color+=vec3(.008,.025,.023)*wash;
    if(abs(vNormal.y)>.5)color=base*.65;
    gl_FragColor=vec4(color*uTint,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #include <fog_fragment>
   }`
 });
}

export function createSky(scene:THREE.Scene){
 const sky=new THREE.Mesh(new THREE.SphereGeometry(1300,32,20),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{uTint:{value:new THREE.Vector3(1,1,1)}},vertexShader:`varying vec3 vPosition;void main(){vPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`uniform vec3 uTint;varying vec3 vPosition;void main(){float h=normalize(vPosition).y;vec3 c=mix(vec3(.07,.14,.145),vec3(.006,.019,.029),smoothstep(-.15,.8,h));float cloud=sin(vPosition.x*.013+sin(vPosition.z*.007)*3.)*.5+.5;c+=vec3(.012,.016,.025)*cloud*(1.-smoothstep(.0,.6,h));gl_FragColor=vec4(c*uTint,1.);}` }));
 sky.name='Deep indigo atmospheric sky';scene.add(sky);
}
