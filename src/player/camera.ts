import * as THREE from 'three';
import {PointerLockControls} from 'three/addons/controls/PointerLockControls.js';
import {EYE_HEIGHT,moveWithCollision} from './collision';
export const views=[
 {name:'实验室',label:'实验室 · 自由探索',position:[3.2,EYE_HEIGHT,3.6],target:[-.8,1.6,-2.5]},
 {name:'工作台',label:'电脑工作台',position:[-2,EYE_HEIGHT,-2.4],target:[-3.7,1.8,-4.4]},
 {name:'机械臂',label:'机器人展示区',position:[4.95,EYE_HEIGHT,-1.9],target:[3.1,1.16,-3.7]},
 {name:'全息核心',label:'全息网络核心',position:[2.4,EYE_HEIGHT,1.9],target:[.45,2,.05]},
 {name:'雨夜都市',label:'观景窗 · 高层 132F',position:[4.35,EYE_HEIGHT,1.2],target:[85,5,-8]},
 {name:'二楼生活区',label:'133F · 私人生活舱',position:[.5,5+EYE_HEIGHT,1],target:[-4,6,-2.7]},
 {name:'后侧全景窗',label:'后侧全景窗 · 132F',position:[1.9,EYE_HEIGHT,3.7],target:[0,9,90]},
 {name:'玻璃电梯',label:'可视电梯 · E 呼叫 / 乘坐',position:[5.2,EYE_HEIGHT,2.1],target:[5.2,1.4,4.7]},
 {name:'二楼健身区',label:'133F · 健康与运动',position:[4.8,5+EYE_HEIGHT,.8],target:[2.9,6.1,-2.9]},
 {name:'实验组装台',label:'零件收集 / 传感器组装',position:[-3.9,EYE_HEIGHT,.4],target:[-5.05,1.2,.25]},
 {name:'二楼观景区',label:'133F · 生活观景区',position:[.7,5+EYE_HEIGHT,1.2],target:[-2.2,5.8,4.5]}
];
export function createCamera(canvas:HTMLCanvasElement){
 const camera=new THREE.PerspectiveCamera(67,innerWidth/innerHeight,.08,1600);
 const controls=new PointerLockControls(camera,canvas);
 controls.minPolarAngle=.12;controls.maxPolarAngle=Math.PI-.12;controls.pointerSpeed=.75;
 const keys=new Set<string>();const velocity=new THREE.Vector2();const forward=new THREE.Vector3();
 const resetKeys=()=>{keys.clear();velocity.set(0,0);};
 let floorHeight=0,travelLocked=false;
 document.addEventListener('keydown',e=>{
  if(!controls.isLocked)return;
  if(e.code==='Escape'){controls.unlock();return;}
  if(['KeyW','KeyA','KeyS','KeyD','ShiftLeft','ShiftRight'].includes(e.code)){e.preventDefault();keys.add(e.code);}
 });
 document.addEventListener('keyup',e=>keys.delete(e.code));
 window.addEventListener('blur',resetKeys);document.addEventListener('visibilitychange',resetKeys);controls.addEventListener('unlock',resetKeys);
 function setView(index:number){if(travelLocked)return;const view=views[index];if(!view)return;resetKeys();floorHeight=view.position[1]-EYE_HEIGHT;camera.position.fromArray(view.position);camera.lookAt(new THREE.Vector3().fromArray(view.target));}
 setView(4);
 return {camera,controls,setView,get floorHeight(){return floorHeight;},get travelLocked(){return travelLocked;},setTravel(value:boolean){travelLocked=value;resetKeys();},setFloor(height:number){floorHeight=height;camera.position.y=height+EYE_HEIGHT;},lock(){controls.lock();},unlock(){controls.unlock();},update(dt:number){
  if(!controls.isLocked||travelLocked)return;
  const x=Number(keys.has('KeyD'))-Number(keys.has('KeyA'));
  const z=Number(keys.has('KeyW'))-Number(keys.has('KeyS'));
  const length=Math.hypot(x,z)||1;const speed=keys.has('ShiftLeft')||keys.has('ShiftRight')?3.6:2.35;
  const damping=1-Math.exp(-dt*13);velocity.x=THREE.MathUtils.lerp(velocity.x,x/length*speed,damping);velocity.y=THREE.MathUtils.lerp(velocity.y,z/length*speed,damping);
  camera.getWorldDirection(forward);forward.y=0;forward.normalize();
  const dx=(forward.x*velocity.y-forward.z*velocity.x)*dt;
  const dz=(forward.z*velocity.y+forward.x*velocity.x)*dt;
  moveWithCollision(camera.position,dx,dz,floorHeight);camera.position.y=floorHeight+EYE_HEIGHT;
 },resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}};
}
