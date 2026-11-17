import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {box,cylinder,dark,silver,neon,label,screen} from './primitives';

export function createLiving(scene:THREE.Scene){
 const root=new THREE.Group();root.name='133F / private living quarters';root.position.y=5;scene.add(root);
 const fabric=new THREE.MeshStandardMaterial({color:0x526d78,roughness:.95});
 const bedding=new THREE.MeshStandardMaterial({color:0xa0b4b2,roughness:.98});
 const charcoal=new THREE.MeshStandardMaterial({color:0x23313b,metalness:.4,roughness:.55});
 const wood=new THREE.MeshStandardMaterial({color:0x624e40,roughness:.75});
 const warm=neon(0xffc58c,.9),cyan=neon(0x6fd9d1,.7);
 const geo=new RoundedBoxGeometry(1,1,1,3,.1);
 function soft(size:number[],p:number[],mat:THREE.Material){const m=new THREE.Mesh(geo,mat);m.scale.set(size[0],size[1],size[2]);m.position.set(p[0],p[1],p[2]);m.castShadow=true;m.receiveShadow=true;root.add(m);return m;}
 const bed=new THREE.Group();bed.name='Habitat / bed';root.add(bed);const bedStart=root.children.length;
 // Sleeping platform: layered mattress, headboard, pillows, throw and low warm wash.
 box(root,[2.6,.25,3.6],[-4.65,.27,-3.1],charcoal);
 box(root,[2.3,.04,3.3],[-4.65,.13,-3.1],warm);
 soft([2.4,.29,3.35],[-4.65,.53,-3.1],bedding);
 soft([2.37,.15,2.45],[-4.65,.74,-2.65],fabric);
 soft([2.65,1.4,.18],[-4.65,.8,-4.85],charcoal);
 for(const x of [-5.24,-4.05])soft([1.02,.21,.65],[x,.78,-4.25],bedding);
 box(root,[2.35,.055,.7],[-4.65,.84,-1.73],new THREE.MeshStandardMaterial({color:0x3d505e,roughness:1}));
 for(const x of [-6.25,-3.05]){
  soft([.55,.54,.65],[x,.3,-4.3],charcoal);cylinder(root,.12,.035,[x,.61,-4.3],silver);
  cylinder(root,.025,.32,[x,.78,-4.3],silver);cylinder(root,.17,.12,[x,.97,-4.3],warm);
 }
 label(root,'REST / RECHARGE',2.4,[-5.8,2.25,-5.7],'#d8c0a1');
 root.children.slice(bedStart).forEach(o=>bed.add(o));
 for(let i=0;i<12;i++)box(root,[.055,2.8,.06],[-6.55+i*.29,1.7,-5.77],wood);
 // Wardrobe and a compact domestic galley with sink, induction hob and coffee unit.
 box(root,[.7,2.5,2.2],[-6.1,1.25,.7],charcoal);
 for(const z of [.17,1.25]){box(root,[.025,2.3,1.02],[-5.73,1.25,z],wood);box(root,[.03,.4,.025],[-5.7,1.2,z+.34],silver);}
 const galley=new THREE.Group();galley.position.x=1.7;root.add(galley);
 box(galley,[3.8,.9,.85],[-3,.47,-5.08],charcoal);box(galley,[3.9,.07,.95],[-3,.96,-5.08],silver);
 for(let i=0;i<4;i++){box(galley,[.87,.72,.03],[-4.43+i*.94,.48,-4.63],wood);box(galley,[.2,.025,.025],[-4.43+i*.94,.73,-4.6],silver);}
 box(galley,[.85,.025,.48],[-3.5,1.01,-5.04],dark);
 for(const x of [-3.72,-3.3]){const ring=new THREE.Mesh(new THREE.TorusGeometry(.14,.012,6,24),cyan);ring.rotation.x=Math.PI/2;ring.position.set(x,1.03,-5.04);galley.add(ring);}
 const faucet=new THREE.Group();faucet.name='Habitat / water tap';galley.add(faucet);
 box(faucet,[.65,.025,.45],[-2.45,1.01,-5.08],dark);
 cylinder(faucet,.025,.3,[-2.45,1.15,-5.35],silver);box(faucet,[.23,.035,.035],[-2.34,1.31,-5.35],silver);
 box(faucet,[.035,.035,.27],[-2.24,1.31,-5.23],silver);
 const handle=box(faucet,[.13,.025,.025],[-2.52,1.22,-5.35],silver);
 // A forgiving selection volume covers the small tap and basin, without selecting the whole galley.
 const tapTarget=box(faucet,[.65,.37,.57],[-2.45,1.19,-5.12],new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));tapTarget.castShadow=false;tapTarget.receiveShadow=false;
 const waterMat=new THREE.MeshStandardMaterial({color:0x8ce5ed,transparent:true,opacity:.65,roughness:.12});
 const stream=cylinder(faucet,.014,.27,[-2.24,1.15,-5.1],waterMat);stream.name='Running tap water';stream.visible=false;stream.raycast=()=>{};
 const ripples:THREE.Mesh[]=[];
 for(let i=0;i<3;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(.07,.003,5,24),waterMat);r.rotation.x=Math.PI/2;r.position.set(-2.24,1.027,-5.1);r.visible=false;r.raycast=()=>{};faucet.add(r);ripples.push(r);}
 box(galley,[.45,.55,.45],[-1.48,1.27,-5.12],charcoal);box(galley,[.31,.22,.03],[-1.48,1.3,-4.88],dark);
 cylinder(galley,.075,.13,[-1.48,1.1,-4.79],bedding);
 screen(galley,'HABITAT / AIR + WATER',[1.15,.65],[-2.3,2.14,-5.75],1);
 box(galley,[3.85,.035,.08],[-3,1.75,-5.59],warm);
 // Seating at the new rear panorama leaves the central route to the lift clear.
 box(root,[4.6,.016,3.4],[-2.2,.03,3.6],new THREE.MeshStandardMaterial({color:0x263e43,roughness:1}));
 soft([2.8,.34,1.1],[-2.2,.45,4.55],fabric);soft([2.8,.8,.22],[-2.2,.87,5.06],fabric);
 for(const x of [-3.48,-.92])soft([.22,.53,1.1],[x,.7,4.55],charcoal);
 soft([1.8,.12,.7],[-2.2,.55,2.9],wood);for(const x of [-2.85,-1.55])box(root,[.055,.5,.5],[x,.27,2.9],charcoal);
 cylinder(root,.1,.16,[-2.5,.7,2.9],bedding);box(root,[.42,.02,.28],[-1.9,.63,2.9],dark);
 // Treadmill: raised deck, rollers, moving belt, safety rails and a live display.
 const treadmill=new THREE.Group();treadmill.position.set(2.85,0,-2.9);root.add(treadmill);treadmill.name='Maglev treadmill';
 box(treadmill,[1.1,.2,2.4],[0,.18,0],charcoal);
 const beltMat=new THREE.MeshStandardMaterial({color:0x0c181d,roughness:.85});
 box(treadmill,[.83,.025,1.9],[0,.3,.08],beltMat);
 const treads:THREE.Mesh[]=[];for(let i=0;i<14;i++)treads.push(box(treadmill,[.76,.008,.012],[0,.32,-.8+i*.13],silver));
 for(const x of [-.49,.49]){box(treadmill,[.06,.025,2.1],[x,.3,0],cyan);box(treadmill,[.065,1.25,.07],[x,.86,-.8],silver);box(treadmill,[.065,.065,.9],[x,1.39,-.4],silver);}
 box(treadmill,[1.06,.12,.32],[0,1.47,-.81],charcoal);
 const display=screen(treadmill,'STRIDE / STANDBY',[.75,.34],[0,1.69,-.84],1);
 cylinder(treadmill,.05,.025,[.4,1.54,-.7],neon(0xe7896b,.7));
 label(root,'KINETIC / WELLNESS',2.1,[1.9,2.65,-5.8],'#82d9d1');
 box(root,[.7,.1,1.2],[5.25,.13,-3.5],charcoal);
 for(const z of [-3.85,-3.2]){
  const bar=cylinder(root,.028,.5,[5.25,.3,z],silver);bar.rotation.z=Math.PI/2;
  for(const x of [5.04,5.46])cylinder(root,.12,.13,[x,.3,z],dark).rotation.z=Math.PI/2;
 }
 // Air purifier, plant, wall clock and warm task lighting complete the habitat.
 soft([.5,1,.5],[1.25,.52,-5.2],bedding);for(let i=0;i<6;i++)box(root,[.35,.016,.02],[1.25,.6+i*.05,-4.94],dark);
 box(root,[.32,.025,.025],[1.25,1.04,-4.94],cyan);
 cylinder(root,.25,.5,[-5.8,.26,4.6],charcoal,.3);
 const leafMat=new THREE.MeshStandardMaterial({color:0x356559,roughness:.85});
 for(let i=0;i<9;i++){const a=i*2.4;const leaf=new THREE.Mesh(new THREE.SphereGeometry(1,8,6),leafMat);leaf.scale.set(.12,.55,.07);leaf.position.set(-5.8+Math.cos(a)*.2,.8+(i%3)*.16,4.6+Math.sin(a)*.2);leaf.rotation.z=Math.sin(a)*.6;root.add(leaf);}
 label(root,'133 / HABITAT',2.7,[-.8,3.4,-5.79],'#c4c7c2');
 const light=new THREE.PointLight(0xffd0a2,42,11,1.5);light.position.set(-3,3,-2);root.add(light);
 const wellness=new THREE.PointLight(0x8fd2dc,16,7,1.7);wellness.position.set(3.5,3,-1);root.add(wellness);
 const ambient=new THREE.PointLight(0xc3d2d5,22,11,1.5);ambient.position.set(0,3.5,2);root.add(ambient);
 const upperFloor=new THREE.MeshStandardMaterial({color:0x34464b,metalness:.25,roughness:.6});
 for(let x=-6;x<=6;x+=2)for(let z=-5;z<=5;z+=2){if(x>=4&&z>=3)continue;box(root,[1.97,.012,1.97],[x,.008,z],upperFloor);}
 for(const x of [-6.7,6.7])for(const z of [-3,1])box(root,[.03,.025,3.8],[x,.14,z],warm);
 for(let x=-6;x<7;x+=2)box(root,[1.93,2.7,.035],[x,2.2,-5.84],charcoal);
 const state={resting:false,restSeconds:0,waterOn:false,litres:0,running:false,speed:6,distance:0};
 let beltOffset=0,screenTick=-1;
 const canvas=document.createElement('canvas');canvas.width=768;canvas.height=448;const ctx=canvas.getContext('2d')!;
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;display.material.map?.dispose();display.material.map=texture;
 return {root,bed,faucet,treadmill,state,setRest(value:boolean){state.resting=value;},setWater(value:boolean){state.waterOn=value;stream.visible=value;handle.rotation.z=value?-.6:0;ripples.forEach(r=>r.visible=value);},setRunning(value:boolean){state.running=value;},setSpeed(value:number){if(Number.isFinite(value))state.speed=THREE.MathUtils.clamp(value,1,12);},update(time:number,dt=0,animate=true){
  if(state.resting)state.restSeconds+=dt;
  if(state.waterOn)state.litres+=dt*.08;
  if(state.running){state.distance+=state.speed/3.6*dt;if(animate)beltOffset=(beltOffset+state.speed/3.6*dt)%1.82;}
  treads.forEach((t,i)=>t.position.z=-.87+((i*.13+beltOffset)%1.82));
  if(animate)ripples.forEach((r,i)=>r.scale.setScalar(.25+((time*1.1+i/3)%1)*1.6));
  const tick=Math.floor(time*4);if(tick!==screenTick){screenTick=tick;ctx.fillStyle='#04151f';ctx.fillRect(0,0,768,448);ctx.fillStyle='#8ae2d4';ctx.font='32px monospace';ctx.fillText('STRIDE / '+(state.running?'RUNNING':'STANDBY'),35,70);ctx.font='72px monospace';ctx.fillText((state.running?state.speed.toFixed(1):'0.0')+' KM/H',35,215);ctx.font='30px monospace';ctx.fillText(state.distance.toFixed(1)+' M / TOTAL',35,320);texture.needsUpdate=true;}
 }};
}
