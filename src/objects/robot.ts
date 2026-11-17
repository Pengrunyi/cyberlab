import * as THREE from 'three';
import {box,cylinder,silver,dark,neon,label,screen} from './primitives';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

export function createRobot(scene:THREE.Scene){
 const root=new THREE.Group();root.position.set(3.1,0,-3.7);scene.add(root);root.name='Robotic arm display';
 const armor=new THREE.MeshStandardMaterial({color:0x91a5ad,metalness:.65,roughness:.34});
 const titanium=new THREE.MeshStandardMaterial({color:0x354853,metalness:.82,roughness:.27});
 const rubber=new THREE.MeshStandardMaterial({color:0x11191d,metalness:.05,roughness:.8});
 const cyan=neon(0x45ced7,.75),amber=neon(0xef9e4e,.6);
 const rounded=new RoundedBoxGeometry(1,1,1,2,.12);
 function shell(parent:THREE.Object3D,size:number[],p:number[],material:THREE.Material=armor){const m=new THREE.Mesh(rounded,material);m.scale.set(...size as [number,number,number]);m.position.set(...p as [number,number,number]);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function cable(parent:THREE.Object3D,points:number[][],radius=.018,material:THREE.Material=rubber){const path=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p as [number,number,number])));const m=new THREE.Mesh(new THREE.TubeGeometry(path,24,radius,6,false),material);parent.add(m);return m;}
 function ring(parent:THREE.Object3D,r:number,tube:number,p:number[],material:THREE.Material,axis='z'){const m=new THREE.Mesh(new THREE.TorusGeometry(r,tube,8,40),material);m.position.set(...p as [number,number,number]);if(axis==='y')m.rotation.x=Math.PI/2;parent.add(m);return m;}
 function joint(parent:THREE.Object3D,r:number,width:number){
  cylinder(parent,r,width,[0,0,0],titanium).rotation.x=Math.PI/2;
  for(const side of [-1,1]){
   cylinder(parent,r*.77,.035,[0,0,side*(width/2+.014)],armor).rotation.x=Math.PI/2;
   ring(parent,r*.58,.012,[0,0,side*(width/2+.035)],cyan);
   cylinder(parent,r*.32,.047,[0,0,side*(width/2+.04)],dark).rotation.x=Math.PI/2;
   for(let i=0;i<6;i++){const a=i*Math.PI/3;cylinder(parent,.016,.018,[Math.cos(a)*r*.83,Math.sin(a)*r*.83,side*(width/2+.036)],silver).rotation.x=Math.PI/2;}
  }
 }
 function link(parent:THREE.Object3D,length:number,width:number){
  shell(parent,[width,length*.73,width*.85],[0,length*.5,0],titanium);
  for(const side of [-1,1]){
   shell(parent,[width*.86,length*.65,.055],[0,length*.51,side*width*.47]);
   box(parent,[.025,length*.37,.012],[-width*.25,length*.52,side*(width*.47+.03)],cyan);
   for(let i=0;i<4;i++)box(parent,[width*.32,.018,.014],[width*.15,length*.32+i*.045,side*(width*.47+.03)],dark);
  }
  for(const x of [-1,1])cylinder(parent,.028,length*.58,[x*width*.58,length*.49,0],silver);
  cable(parent,[[width*.6,.04,-.06],[width*.9,length*.25,-.06],[width*.78,length*.7,-.06],[.03,length-.02,-.06]],.026);
  cable(parent,[[width*.6,.04,.015],[width*.9,length*.25,.015],[width*.78,length*.7,.015],[.03,length-.02,.015]],.011,cyan);
 }
 shell(root,[2.6,.18,1.9],[0,.95,0],titanium);for(const x of [-1,1]){shell(root,[.18,.9,1.5],[x,.45,0],titanium);box(root,[.22,.08,1.65],[x,.08,0],dark);}
 box(root,[2.42,.025,.025],[0,1.048,.94],cyan);
 box(root,[2.38,.014,1.72],[0,1.047,0],dark);
 for(let i=0;i<11;i++)for(const z of [-.63,.63])box(root,[.016,.008,.24],[-1.05+i*.21,1.059,z],titanium);
 for(const x of [-1.14,1.14])for(const z of [-.75,.75])cylinder(root,.028,.012,[x,1.065,z],silver);
 cylinder(root,.34,.05,[0,1.08,0],titanium);cylinder(root,.29,.19,[0,1.19,0],armor);
 ring(root,.295,.012,[0,1.2,0],cyan,'y');cylinder(root,.23,.06,[0,1.3,0],dark);
 for(let i=0;i<12;i++){const a=i*Math.PI/6;box(root,[.022,.08,.03],[Math.cos(a)*.29,1.2,Math.sin(a)*.29],titanium);}
 const base=new THREE.Group();base.position.y=1.33;root.add(base);
 const shoulder=new THREE.Group();base.add(shoulder);
 joint(shoulder,.205,.38);link(shoulder,.85,.25);
 const elbow=new THREE.Group();elbow.position.y=.85;shoulder.add(elbow);joint(elbow,.17,.34);link(elbow,.8,.21);
 const wrist=new THREE.Group();wrist.position.y=.8;elbow.add(wrist);
 joint(wrist,.105,.23);shell(wrist,[.31,.085,.2],[0,-.075,0],titanium);
 box(wrist,[.22,.018,.015],[0,-.113,.105],cyan);
 const fingers=[new THREE.Group(),new THREE.Group()];
 fingers.forEach((finger,i)=>{wrist.add(finger);finger.position.set(i===0?-.12:.12,-.15,0);shell(finger,[.043,.18,.09],[0,0,0],armor);box(finger,[.016,.075,.065],[i===0?.027:-.027,-.033,0],rubber);cylinder(finger,.025,.1,[0,.055,0],titanium).rotation.x=Math.PI/2;});
 cylinder(wrist,.035,.03,[0,-.08,.13],dark).rotation.x=Math.PI/2;
 cylinder(wrist,.021,.033,[0,-.08,.15],cyan).rotation.x=Math.PI/2;
 const tip=new THREE.Object3D();tip.position.y=-.2;wrist.add(tip);
 const cube=shell(root,[.22,.22,.22],[.74,1.2,.25],armor);cube.name='Graspable test cube';
 box(cube,[.72,.08,1.01],[0,0,0],amber);
 for(const x of [-.7,.74]){box(root,[.4,.028,.4],[x,1.07,.25],titanium);for(const side of [-1,1])box(root,[.06,.01,.36],[x+side*.18,1.09,.25],x<0?cyan:amber);}
 screen(root,'SERVO TELEMETRY',[.48,.28],[-.88,1.28,-.64],1).rotation.x=-.2;
 for(let i=0;i<3;i++){cylinder(root,.035,.025,[.73+i*.14,1.07,-.65],i===2?amber:cyan);}
 for(let i=0;i<3;i++){const tool=box(root,[.035,.035,.28],[.7+i*.14,1.08,-.2],silver);tool.rotation.y=.25;}
 cable(root,[[-.15,1.08,-.2],[-.35,1.09,-.65],[-1.15,1.09,-.7],[-1.29,.7,-.7],[-1.18,.25,-.5]],.028);
 label(root,'KINETIC / R-07',1.25,[-1.1,.78,.96],'#9cd4d9');
 label(shoulder,'07',.2,[-.09,.48,.158],'#172c36');
 type Pose={base:number;shoulder:number;elbow:number;grip:number};
 const pose:Pose={base:0,shoulder:-35,elbow:-70,grip:1};let busy=false,phase='READY',stage=0,clock=0,held=false,cycles=0;
 const world=new THREE.Vector3();const rad=THREE.MathUtils.degToRad;
 function apply(){base.rotation.y=rad(pose.base);shoulder.rotation.z=rad(pose.shoulder);elbow.rotation.z=rad(pose.elbow);wrist.rotation.z=-rad(pose.shoulder+pose.elbow);fingers[0].position.x=-.13-pose.grip*.065;fingers[1].position.x=.13+pose.grip*.065;root.updateMatrixWorld(true);if(held){tip.getWorldPosition(world);root.worldToLocal(world);cube.position.copy(world);}root.userData.poseRevision=(root.userData.poseRevision??0)+1;}
 function solve(x:number,z:number,y:number,grip:number):Pose {
  const r=Math.hypot(x,z),dy=y-1.33;const e=-Math.acos(THREE.MathUtils.clamp((r*r+dy*dy-.85*.85-.8*.8)/(2*.85*.8),-1,1));
  const s=Math.atan2(dy,r)-Math.atan2(.8*Math.sin(e),.85+.8*Math.cos(e))-Math.PI/2;
  return {base:THREE.MathUtils.radToDeg(-Math.atan2(z,x)),shoulder:THREE.MathUtils.radToDeg(s),elbow:THREE.MathUtils.radToDeg(e),grip};
 }
 const pickup=solve(.74,.25,1.4,1),lift=solve(.65,.25,2,0),drop=solve(-.7,.25,1.4,0),home={...pose};
 const stages=[{name:'REACH',duration:1.5,to:pickup},{name:'GRIP',duration:.55,to:{...pickup,grip:0}},{name:'LIFT',duration:1,to:lift},{name:'TRANSFER',duration:1.6,to:solve(-.7,.25,2,0)},{name:'LOWER',duration:1,to:drop},{name:'RELEASE',duration:.55,to:{...drop,grip:1}},{name:'HOME',duration:1.3,to:home}];
 let from:Pose={...pose};
 function reset(){busy=false;held=false;phase='READY';Object.assign(pose,home);cube.position.set(.74,1.2,.25);apply();}
 apply();
 return {root,pose,get state(){return {busy,phase,held,cycles,cube:cube.position.toArray()};},setJoint(key:keyof Pose,value:number){if(busy)return;pose[key]=key==='grip'?THREE.MathUtils.clamp(value,0,1):THREE.MathUtils.clamp(value,-160,160);apply();},start(){if(busy)return;reset();busy=true;stage=0;clock=0;from={...pose};phase=stages[0].name;},reset,update(dt:number){
  if(!busy)return;clock+=dt;const current=stages[stage],t=THREE.MathUtils.smoothstep(Math.min(clock/current.duration,1),0,1);
  for(const key of Object.keys(pose) as (keyof Pose)[])pose[key]=THREE.MathUtils.lerp(from[key],current.to[key],t);
  apply();if(clock<current.duration)return;
  if(stage===1)held=true;
  if(stage===5){held=false;cube.position.set(-.7,1.2,.25);}
  stage++;clock=0;from={...pose};if(stage>=stages.length){busy=false;phase='COMPLETE';cycles++;}else phase=stages[stage].name;
 }};
}
