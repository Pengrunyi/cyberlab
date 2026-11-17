import * as THREE from 'three';
import {box} from '../objects/primitives';

// Original procedural advertising art, mapped only onto physical city screens.
const signs=[
 {x:40.2,y:8,z:-60,w:10,h:23,text:'記憶',sub:'MEMORY / RECONSTRUCTED',color:'#53ddd2',art:1},
 {x:44.2,y:-7,z:63,w:13,h:22,text:'夜行',sub:'AFTER HOURS',color:'#ef65b7',art:2},
 {x:70.4,y:17,z:-26,w:15,h:27,text:'新生',sub:'SYNTHETIC DREAMS',color:'#67e0e3',art:1},
 {x:81.9,y:9,z:35,w:13,h:33,text:'夢',sub:'BE MORE HUMAN',color:'#e77bbb',art:2},
 {x:95.1,y:-8,z:-14,w:10,h:24,text:'NEXUS',sub:'A NEW CONSCIOUSNESS',color:'#e18de6',art:2},
 {x:118.2,y:2,z:21,w:15,h:11,text:'光 年',sub:'LIGHT YEARS / OFF WORLD',color:'#79d4e6',art:0},
 {x:70,y:-12,z:-17,w:3.5,h:22,text:'HOTEL',sub:'OPEN',color:'#f35c73',art:3},
 {x:81.8,y:-26,z:27,w:4,h:14,text:'メモリ',sub:'24H',color:'#8edee2',art:3},
 {x:70,y:-9,z:-32,w:4,h:17,text:'電脳',sub:'ONLINE',color:'#e773bd',art:3},
 {x:81.8,y:-17,z:35,w:8,h:5,text:'夜市場',sub:'NIGHT MARKET',color:'#81ded0',art:0},
 {x:97,y:-46,z:-14,w:13,h:5,text:'MOTIVE',sub:'MAKE YOUR NEXT SELF',color:'#78baca',art:0},
 {x:118,y:-20,z:21,w:9,h:7,text:'東京 07',sub:'TRANSIT AUTHORITY',color:'#efad6d',art:0},
 {x:70,y:-28,z:-26,w:17,h:5,text:'REPLICANT',sub:'DESIGNED TO FEEL',color:'#84b7df',art:0},
 {x:81.8,y:-39,z:35,w:12,h:5,text:'深夜食堂',sub:'MIDNIGHT / NOODLES',color:'#e18ba4',art:0},
 {x:157,y:23,z:-58,w:16,h:27,text:'永遠',sub:'ETERNAL / INDUSTRIES',color:'#b09cdd',art:1},
 {x:170,y:-4,z:64,w:12,h:24,text:'NEON',sub:'NEW REALITIES',color:'#69cbbf',art:2}
];
function artwork(s:typeof signs[number],index:number){
 const c=document.createElement('canvas');c.width=512;c.height=Math.round(512*s.h/s.w);
 const g=c.getContext('2d')!,h=c.height;
 g.fillStyle='#07171c';g.fillRect(0,0,512,h);
 const grad=g.createLinearGradient(0,0,512,h);grad.addColorStop(0,s.color);grad.addColorStop(.48,s.art===1?'#13516a':'#63235c');grad.addColorStop(1,'#0a2029');
 if(s.art===1||s.art===2){
  g.fillStyle=grad;g.fillRect(0,0,512,h);
  g.globalAlpha=.2;g.strokeStyle='#d9ffff';g.lineWidth=3;
  for(let i=-6;i<12;i++){g.beginPath();g.moveTo(i*80,0);g.lineTo(i*80-340,h);g.stroke();}
  g.globalAlpha=1;g.save();g.translate(256,h*.44);g.scale(1,Math.min(1.5,h/700));
  g.shadowColor=s.color;g.shadowBlur=24;g.strokeStyle='#b8ffff';g.lineWidth=4;
  if(s.art===1){
   // Android portrait with visor, segmented neck, ear actuator and suit.
   g.fillStyle='#0a2030';g.beginPath();g.moveTo(-185,270);g.bezierCurveTo(-180,120,-48,160,-58,63);g.bezierCurveTo(-140,22,-147,-89,-94,-153);g.bezierCurveTo(-52,-215,57,-198,84,-146);g.lineTo(92,-77);g.lineTo(127,-39);g.lineTo(93,-27);g.bezierCurveTo(105,28,70,58,27,60);g.lineTo(31,114);g.bezierCurveTo(108,143,174,156,199,270);g.closePath();g.fill();g.stroke();
   g.fillStyle='#e3a6c4';g.beginPath();g.moveTo(-28,-153);g.bezierCurveTo(67,-173,71,-114,69,-78);g.lineTo(99,-42);g.lineTo(69,-32);g.lineTo(67,16);g.lineTo(17,35);g.lineTo(-25,-4);g.closePath();g.fill();
   g.fillStyle='#122c3d';g.fillRect(-91,-115,178,48);g.fillStyle='#9af6ee';g.fillRect(-65,-96,158,8);
   g.strokeStyle=s.color;for(let k=0;k<5;k++){g.beginPath();g.moveTo(-54,72+k*12);g.lineTo(24,99+k*12);g.stroke();}
   g.beginPath();g.moveTo(-170,250);g.lineTo(-118,163);g.lineTo(-30,186);g.lineTo(0,259);g.moveTo(21,259);g.lineTo(58,166);g.lineTo(153,202);g.stroke();
   g.beginPath();g.arc(-65,-51,25,0,Math.PI*2);g.stroke();
  }else{
   // Armoured courier in front of a luminous disc.
   g.fillStyle='#f4b0e4';g.globalAlpha=.75;g.beginPath();g.arc(0,-65,154,0,Math.PI*2);g.fill();g.globalAlpha=1;
   g.fillStyle='#132235';g.beginPath();g.moveTo(-123,255);g.lineTo(-117,55);g.lineTo(-61,14);g.lineTo(-62,-104);g.lineTo(-29,-151);g.lineTo(45,-151);g.lineTo(74,-107);g.lineTo(68,11);g.lineTo(125,59);g.lineTo(146,218);g.lineTo(92,239);g.lineTo(60,112);g.lineTo(51,277);g.lineTo(-37,277);g.lineTo(-67,112);g.lineTo(-78,258);g.closePath();g.fill();g.stroke();
   g.fillStyle=s.color;g.fillRect(-54,-98,117,19);g.fillStyle='#071b2b';g.fillRect(-28,-94,81,7);
   g.strokeStyle='#90c8db';g.lineWidth=5;for(let i=0;i<4;i++){g.beginPath();g.moveTo(-55,51+i*29);g.lineTo(9,77+i*24);g.lineTo(65,49+i*29);g.stroke();}
  }
  g.restore();g.shadowBlur=0;
  const fade=g.createLinearGradient(0,h*.68,0,h);fade.addColorStop(0,'#081c2600');fade.addColorStop(1,'#081c26');g.fillStyle=fade;g.fillRect(0,h*.68,512,h*.32);
 }
 g.textAlign='center';g.fillStyle=s.color;g.shadowColor=s.color;g.shadowBlur=12;
 if(s.art===3){
  const letters=Array.from(s.text);g.font=`700 ${Math.min(145,(h-130)/letters.length)}px "Segoe UI",sans-serif`;
  letters.forEach((letter,i)=>g.fillText(letter,256,100+(i+.65)*(h-200)/letters.length,430));
 }else{
  g.font=`700 ${s.art===0?94:108}px "Segoe UI",sans-serif`;g.fillText(s.text,256,s.art===0?h*.5+15:h*.83,465);
 }
 g.shadowBlur=0;g.font='20px "Segoe UI",sans-serif';g.fillStyle='#d4eee8';g.fillText(s.sub,256,s.art===0?h*.77:h*.92,460);
 g.textAlign='left';g.font='14px sans-serif';g.fillText(`NIGHT CITY / ${2077+index}`,22,32);
 g.globalAlpha=.17;g.fillStyle='#03121b';for(let y=0;y<h;y+=4)g.fillRect(0,y,512,1);
 g.globalAlpha=.15;g.fillStyle='#cffff7';for(let i=0;i<2800;i++)g.fillRect((i*137.508)%512,(i*59.137)%h,1,1);
 g.globalAlpha=1;return c;
}
export function createAdvertisements(parent:THREE.Object3D){
 const housing=new THREE.MeshStandardMaterial({color:0x0c1b24,metalness:.65,roughness:.38});
 const animated=signs.map((s,i)=>{
  const texture=new THREE.CanvasTexture(artwork(s,i));texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;
  const material=new THREE.ShaderMaterial({uniforms:{uMap:{value:texture},uTime:{value:0},uPhase:{value:i*1.7}},side:THREE.DoubleSide,
   vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
   fragmentShader:`varying vec2 vUv;uniform sampler2D uMap;uniform float uTime;uniform float uPhase;void main(){vec3 c=texture2D(uMap,vUv).rgb;float scan=1.-.06*pow(sin(vUv.y*900.+uTime*2.),2.);float sweep=exp(-pow((vUv.y-fract(uTime*.09+uPhase))*48.,2.));c*=scan*(.97+.03*sin(uTime*.8+uPhase));c+=c*sweep*.15;gl_FragColor=vec4(c*1.28,1.);
   #include <tonemapping_fragment>
   #include <colorspace_fragment>
   }`});
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(s.w,s.h),material);mesh.position.set(s.x,s.y,s.z);mesh.rotation.y=-Math.PI/2;parent.add(mesh);
  box(parent,[.48,s.h+.6,s.w+.6],[s.x+.3,s.y,s.z],housing);
  for(const y of [-1,1])box(parent,[1.7,.25,s.w+.8],[s.x+.8,s.y+y*(s.h/2+.3),s.z],housing);
  for(const z of [-1,1])box(parent,[.23,s.h+.3,.12],[s.x-.04,s.y,s.z+z*s.w/2],new THREE.MeshBasicMaterial({color:s.color}));
  const glow=new THREE.Mesh(new THREE.PlaneGeometry(s.w*2,s.h*1.6),new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,uniforms:{uColor:{value:new THREE.Color(s.color)}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec2 vUv;uniform vec3 uColor;void main(){float r=length((vUv-.5)*2.);float a=pow(max(0.,1.-r),2.)*.18;gl_FragColor=vec4(uColor,a);}`}));
  glow.position.set(s.x-.3,s.y,s.z);glow.rotation.y=-Math.PI/2;parent.add(glow);
  return material;
 });
 const emblem=new THREE.Group();emblem.position.set(79,8,25);emblem.rotation.y=-Math.PI/2;parent.add(emblem);
 const red=new THREE.MeshBasicMaterial({color:new THREE.Color(1.5,.12,.2)});
 const torus=new THREE.Mesh(new THREE.TorusGeometry(5,.23,8,64),red);emblem.add(torus);
 box(emblem,[12,.3,.3],[0,0,0],red).rotation.z=.35;
 box(emblem,[.35,13,.3],[0,0,0],housing).rotation.z=-.4;
 return (time:number)=>animated.forEach(m=>m.uniforms.uTime.value=time);
}
