import * as THREE from 'three';
import type {createCamera} from '../player/camera';
export type DeviceId='lab'|'terminal'|'hologram'|'robot'|'weather'|'bed'|'faucet'|'treadmill'|'part-battery'|'part-chip'|'part-sensor'|'assembly'|'citymap'|'telescope'|'inventory';
export interface Device {id:DeviceId;label:string;root:THREE.Object3D}
export function createInteraction(scene:THREE.Scene,player:ReturnType<typeof createCamera>,occluders:THREE.Object3D[],devices:Device[],onOpen:(id:DeviceId)=>void,onClose:()=>void){
 const ray=new THREE.Raycaster();ray.far=3;const center=new THREE.Vector2();
 devices.forEach(d=>d.root.userData.device=d.id);
 const prompt=document.createElement('div');prompt.className='interaction-prompt';prompt.hidden=true;prompt.setAttribute('role','status');document.body.append(prompt);
 const outline=new THREE.BoxHelper(new THREE.Object3D(),0x94fce2);outline.visible=false;(outline.material as THREE.LineBasicMaterial).transparent=true;(outline.material as THREE.LineBasicMaterial).opacity=.6;outline.raycast=()=>{};scene.add(outline);
 let target:Device|undefined,opened:DeviceId|undefined;
 function close(){if(!opened)return;opened=undefined;document.body.classList.remove('device-open');onClose();}
 function open(id:DeviceId){opened=id;target=undefined;prompt.hidden=true;outline.visible=false;player.unlock();document.body.classList.add('device-open');onOpen(id);}
 document.addEventListener('keydown',e=>{if(e.code==='Escape'&&opened){e.preventDefault();close();return;}if(e.defaultPrevented||player.travelLocked)return;if(e.code==='KeyE'&&!e.repeat&&player.controls.isLocked&&target){e.preventDefault();open(target.id);}});
 return {get state(){return {target:target?.id,opened};},open(id:DeviceId){close();open(id);},close,update(){
  if(!player.controls.isLocked||opened||player.travelLocked){target=undefined;prompt.hidden=true;outline.visible=false;return;}
  scene.updateMatrixWorld();ray.setFromCamera(center,player.camera);const hit=ray.intersectObjects(occluders,true).find(h=>{let node:THREE.Object3D|null=h.object;while(node){if(!node.visible)return false;node=node.parent;}return true;});let id:DeviceId|undefined;
  if(hit){let node:THREE.Object3D|null=hit.object;while(node){if(node.userData.device){id=node.userData.device;break;}node=node.parent;}}
  const next=devices.find(d=>d.id===id);if(next!==target){target=next;if(target){outline.setFromObject(target.root);prompt.replaceChildren();const key=document.createElement('kbd');key.textContent='E';const text=document.createElement('span');text.textContent=target.label;prompt.append(key,text);}}
  prompt.hidden=!target;outline.visible=!!target;
 }};
}
