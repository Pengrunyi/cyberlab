import * as THREE from 'three';
import {box,dark,silver,neon,label} from './primitives';
import type {createCamera} from '../player/camera';
import {EYE_HEIGHT,liftAccess} from '../player/collision';

export function createElevator(scene:THREE.Scene,player:ReturnType<typeof createCamera>,host:HTMLElement){
 const root=new THREE.Group();root.name='Panoramic lift / two landings';root.position.set(5.25,0,4.4);scene.add(root);
 const cyan=neon(0x6edbe1,.8),warm=neon(0xffbc89,.7);
 const glass=new THREE.MeshPhysicalMaterial({color:0x8ebfc7,transparent:true,opacity:.12,roughness:.12,metalness:.1,depthWrite:false,side:THREE.DoubleSide});
 for(const x of [-1.25,1.25])for(const z of [-1.12,1.2]){box(root,[.1,9.4,.1],[x,4.7,z],silver);box(root,[.025,9.2,.025],[x-.07,4.7,z],cyan);}
 for(const x of [-1.18,1.18]){box(root,[.025,8.8,2.28],[x,4.4,.05],glass);box(root,[.06,8.7,.07],[x,4.4,.45],dark);}
 const cabin=new THREE.Group();cabin.name='Moving glass cabin';root.add(cabin);
 box(cabin,[2.3,.12,2.2],[0,-.06,0],silver);box(cabin,[2.1,.025,2.02],[0,.015,0],dark);
 for(const x of [-1.06,1.06])box(cabin,[.025,.02,1.9],[x,.04,0],cyan);
 box(cabin,[2.3,.1,2.2],[0,2.8,0],silver);box(cabin,[1.4,.025,.1],[0,2.74,0],warm);
 box(cabin,[2.25,2.7,.025],[0,1.4,1.1],glass);box(cabin,[2.1,.04,.06],[0,1.05,1.02],silver);
 for(const x of [-1.1,1.1])box(cabin,[.06,.04,1.95],[x,1.05,0],silver);
 const panel=box(cabin,[.08,.65,.24],[1.03,1.35,.35],dark);
 box(cabin,[.012,.12,.15],[.982,1.45,.35],cyan);box(cabin,[.012,.12,.15],[.982,1.2,.35],warm);
 const landings=[0,5].map(floor=>{
  const g=new THREE.Group();g.position.y=floor;root.add(g);
  for(const x of [-1.25,1.25])box(g,[.14,3,.15],[x,1.5,-1.12],dark);
  box(g,[2.6,.25,.2],[0,2.95,-1.12],dark);
  const doors=[-1,1].map(side=>box(g,[1.15,2.7,.04],[side*.575,1.4,-1.12],glass));
  for(const [i,door]of doors.entries())box(door,[.012,.92,.012],[i===0?.49:-.49,0,-.04],cyan);
  const title=label(g,floor===0?'132 / RESEARCH':'133 / HABITAT',1.9,[-.98,2.88,-1.25]);title.rotation.y=Math.PI;
  const call=box(g,[.2,.38,.1],[-1.42,1.3,-1.2],dark);box(call,[.07,.13,.02],[0,0,-.07],cyan);
  return {doors,floor};
 });
 const message=document.createElement('div');message.className='lift-prompt';message.hidden=true;message.setAttribute('role','status');host.append(message);
 let height=0,destination=0,elapsed=0,phase:'idle'|'closing'|'moving'|'opening'='idle',rider=false;
 function inside(){const p=player.camera.position;return p.x>4.36&&p.x<6.12&&p.z>3.58&&p.z<5.25;}
 function near(){const p=player.camera.position;return p.x>3.7&&p.x<6.5&&p.z>1.9&&p.z<5.5;}
 function request(){
  if(phase!=='idle'||!near())return;
  const floor=player.floorHeight>2.5?5:0;
  if(Math.abs(height-floor)>.1){destination=floor;rider=false;}
  else if(inside()){destination=floor===0?5:0;rider=true;player.setTravel(true);}
  else return;
  elapsed=0;phase='closing';liftAccess.moving=true;
 }
 document.addEventListener('keydown',e=>{if(e.code==='KeyE'&&!e.repeat&&player.controls.isLocked&&!document.body.classList.contains('device-open')&&near()){e.preventDefault();request();}});
 function drawDoors(open:number){for(const landing of landings){const amount=Math.abs(landing.floor-height)<.05?open:0;landing.doors.forEach((d,i)=>d.position.x=(i===0?-1:1)*(.575+amount*1.04));}}
 drawDoors(1);
 return {root,panel,get state(){return {height,destination,phase,rider};},update(dt:number){
  if(phase!=='idle'){
   elapsed+=dt;
   if(phase==='closing'){drawDoors(1-Math.min(1,elapsed/.85));if(elapsed>=.85){phase='moving';elapsed=0;}}
   else if(phase==='moving'){
    const t=Math.min(1,elapsed/4),s=t*t*(3-2*t);height=(destination===5?0:5)+(destination===5?5:-5)*s;cabin.position.y=height;
    if(rider){player.camera.position.x=THREE.MathUtils.clamp(player.camera.position.x,4.4,6.1);player.camera.position.z=THREE.MathUtils.clamp(player.camera.position.z,3.65,5.2);player.camera.position.y=height+EYE_HEIGHT;}
    if(t===1){phase='opening';elapsed=0;liftAccess.floor=destination;}
   }else{drawDoors(Math.min(1,elapsed/.85));if(elapsed>=.85){phase='idle';liftAccess.moving=false;if(rider){player.setFloor(destination);player.setTravel(false);}rider=false;}}
  }
  const floor=player.floorHeight>2.5?5:0;
  const visible=player.controls.isLocked&&near()&&!document.body.classList.contains('device-open');message.hidden=!visible;
  message.textContent=phase!=='idle'?`电梯${phase==='moving'?'运行中':'门禁动作中'} · ${destination===5?'133F 生活区':'132F 实验室'}`:Math.abs(height-floor)>.1?'E  呼叫玻璃电梯':inside()?`E  ${floor===0?'前往二楼 · 生活区':'返回一楼 · 实验室'}`:'步入玻璃轿厢，再按 E 选择楼层';
  root.userData.moving=phase!=='idle';
 }};
}
