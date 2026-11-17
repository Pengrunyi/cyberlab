import * as THREE from 'three';
import {weatherPresets,type WeatherId} from '../scene/weatherPresets';

export function createWeather(scene:THREE.Scene){
 const count=6500;const bases=new Float32Array(count*6),tips=new Float32Array(count*2);
 let seed=132;const random=()=>{seed=seed*16807%2147483647;return seed/2147483647;};
 for(let i=0;i<count;i++){
  const near=i<count*.65,rear=i%3===0;const x=rear?(random()-.5)*(near?100:280):8+random()*(near?55:170),y=-80+random()*160,z=rear?8+random()*(near?55:170):(random()-.5)*(near?100:280);
  for(let j=0;j<2;j++){bases.set([x,y,z],i*6+j*3);tips[i*2+j]=j;}
 }
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(bases,3));geometry.setAttribute('aTip',new THREE.BufferAttribute(tips,1));
 const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,fog:true,uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.fog,{uTime:{value:0},uRain:{value:1}}]),vertexShader:`
  uniform float uTime;attribute float aTip;varying float vAlpha;
  #include <fog_pars_vertex>
  void main(){vec3 p=position;p.y=mod(p.y-uTime*27.+80.,160.)-80.;p+=vec3(.13,.9,.02)*aTip;vec4 mvPosition=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mvPosition;vAlpha=.11+.08*aTip;
  #include <fog_vertex>
  }`,fragmentShader:`varying float vAlpha;uniform float uRain;
  #include <fog_pars_fragment>
  void main(){gl_FragColor=vec4(.49,.62,.8,vAlpha*1.3*uRain);
  #include <fog_fragment>
  }`});
 const rain=new THREE.LineSegments(geometry,material);rain.name='Exterior GPU rain';rain.frustumCulled=false;scene.add(rain);
 const glassMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,uniforms:{uTime:{value:0},uWet:{value:1}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`
 uniform float uTime;uniform float uWet;varying vec2 vUv;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 void main(){
  vec2 uv=vUv*vec2(110.,60.);vec2 cell=floor(uv);float n=hash(cell);vec2 f=fract(uv)-vec2(.25+n*.5,.4);
  f.y=fract(f.y+uTime*.012*(.4+n)+.5)-.5;
  float bead=(1.-smoothstep(.025,.08,length(f*vec2(2.7,.9))))*step(.7,n);
  float rim=(1.-smoothstep(.005,.018,abs(length(f*vec2(2.7,.9))-.05)))*step(.7,n);
  float trail=(1.-smoothstep(.003,.012,abs(f.x)))*(1.-smoothstep(.05,.44,abs(f.y)))*step(.94,n);
  gl_FragColor=vec4(vec3(.26,.39,.5)+rim*.2,min(.16,bead*.06+rim*.08+trail*.08)*uWet);
 }`});
 const glass=new THREE.Mesh(new THREE.PlaneGeometry(11.7,4.3),glassMaterial);glass.name='Rain beads and water trails on glazing';glass.rotation.y=-Math.PI/2;glass.position.set(6.76,2.5,0);scene.add(glass);
 const upperGlass=glass.clone();upperGlass.position.y=7.5;scene.add(upperGlass);
 for(const y of [2.4,7.4]){const rearGlass=new THREE.Mesh(new THREE.PlaneGeometry(13.5,4.3),glassMaterial);rearGlass.position.set(0,y,5.81);rearGlass.name='Rear panorama rain trails';scene.add(rearGlass);}
 const mistMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,uniforms:{uTime:{value:0},uMist:{value:1}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`
  varying vec2 vUv;uniform float uTime;uniform float uMist;
  void main(){vec2 p=vUv;float edges=smoothstep(0.,.18,p.x)*(1.-smoothstep(.82,1.,p.x))*smoothstep(0.,.2,p.y)*(1.-smoothstep(.7,1.,p.y));float cloud=.5+.25*sin(p.x*19.+uTime*.07+sin(p.y*9.))+.2*sin(p.y*22.+p.x*7.-uTime*.05);float alpha=edges*cloud*.17*uMist;gl_FragColor=vec4(.13,.22,.34,alpha);}`});
 for(const [x,y,width,height] of [[58,-35,160,70],[130,-18,260,105],[290,0,500,170]]){
  const mist=new THREE.Mesh(new THREE.PlaneGeometry(width,height),mistMaterial);mist.position.set(x,y,0);mist.rotation.y=-Math.PI/2;mist.name='Layered rain mist';scene.add(mist);
 }
 let preset:WeatherId='storm',progress=1,rainEnabled=true;let current={rain:1,mist:1,fog:.0036,tint:[.82,1.03,1.06]},from={...current,tint:[...current.tint]};
 const skyMaterial=(scene.getObjectByName('Deep indigo atmospheric sky') as THREE.Mesh<THREE.SphereGeometry,THREE.ShaderMaterial>).material;
 const cityMaterial=(scene.getObjectByName('Near / middle / far tower facades') as THREE.Mesh<THREE.BoxGeometry,THREE.ShaderMaterial>).material;
 return {get state(){return {preset,progress,rain:current.rain,mist:current.mist,fog:current.fog};},setPreset(id:WeatherId){if(!(id in weatherPresets))return;preset=id;from={...current,tint:[...current.tint]};progress=0;},setRain(value:boolean){rainEnabled=value;},update(time:number,dt=.016,animate=true){
  progress=Math.min(1,progress+dt/3);const t=progress*progress*(3-2*progress),target=weatherPresets[preset];
  current.rain=THREE.MathUtils.lerp(from.rain,target.rain,t);current.mist=THREE.MathUtils.lerp(from.mist,target.mist,t);current.fog=THREE.MathUtils.lerp(from.fog,target.fog,t);
  for(let i=0;i<3;i++)current.tint[i]=THREE.MathUtils.lerp(from.tint[i],target.tint[i],t);
  if(animate){material.uniforms.uTime.value=time;glassMaterial.uniforms.uTime.value=time;mistMaterial.uniforms.uTime.value=time;}
  material.uniforms.uRain.value=rainEnabled?current.rain:0;glassMaterial.uniforms.uWet.value=current.rain;mistMaterial.uniforms.uMist.value=current.mist;
  (scene.fog as THREE.FogExp2).density=current.fog;skyMaterial.uniforms.uTint.value.set(...current.tint);cityMaterial.uniforms.uTint.value.set(...current.tint);
 },quality(high:boolean){geometry.setDrawRange(0,(high?count:2200)*2);}};
}
