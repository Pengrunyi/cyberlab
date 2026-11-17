import * as THREE from 'three';
import {box,cylinder,metal,silver,neon,label} from './primitives';
import type {Device} from '../interaction/system';

export const partInfo={
 battery:{name:'离子电池',description:'3.7 V 可充电供能单元。为传感器提供独立电源。',color:0xe9ad73},
 chip:{name:'逻辑芯片',description:'本地信号处理器。将传感阵列的采样转换为遥测数据。',color:0x99aaff},
 sensor:{name:'光学传感器',description:'青色光学阵列。通电后扫描空气中的悬浮粒子。',color:0x76e6cf}
};
export type PartId=keyof typeof partInfo;
export type PartState='table'|'inventory'|'installed';
export function createResearch(scene:THREE.Scene){
 const root=new THREE.Group();root.name='Research / collectible components';scene.add(root);
 const parts={} as Record<PartId,{root:THREE.Group;home:THREE.Vector3;state:PartState}>;
 const ids=Object.keys(partInfo) as PartId[];
 ids.forEach((id,i)=>{
  const g=new THREE.Group();g.name=partInfo[id].name;g.position.set(-5.1,1.24,-.8+i*.45);root.add(g);
  const glow=neon(partInfo[id].color,.65);
  if(id==='battery'){cylinder(g,.075,.25,[0,0,0],silver);cylinder(g,.077,.06,[0,.04,0],glow);cylinder(g,.035,.025,[0,.137,0],silver);}
  if(id==='chip'){box(g,[.22,.045,.2],[0,0,0],metal);box(g,[.12,.025,.12],[0,.035,0],glow);for(const side of [-1,1])for(let j=0;j<5;j++)box(g,[.055,.02,.018],[side*.13,0,-.08+j*.04],silver);}
  if(id==='sensor'){box(g,[.18,.13,.17],[0,0,0],silver);const lens=cylinder(g,.06,.05,[.11,0,0],glow);lens.rotation.z=Math.PI/2;}
  parts[id]={root:g,home:g.position.clone(),state:'table'};
 });
 const assembly=new THREE.Group();assembly.position.set(-5.05,1.1,1.36);root.add(assembly);assembly.name='Sensor assembly dock';
 box(assembly,[.54,.06,.62],[0,0,0],metal);box(assembly,[.04,.015,.58],[.25,.04,0],neon(0x75d8c5,.4));
 const slots=ids.map((id,i)=>{const slot=box(assembly,[.28,.02,.13],[0,.04,-.2+i*.2],neon(partInfo[id].color,.15));return slot;});
 label(assembly,'ASSEMBLY',.6,[-.22,.16,.23]);
 const scanner=new THREE.Mesh(new THREE.ConeGeometry(.26,.65,24,1,true),new THREE.MeshBasicMaterial({color:0x77ffcf,transparent:true,opacity:.14,side:THREE.DoubleSide,depthWrite:false}));scanner.position.y=.44;scanner.visible=false;assembly.add(scanner);
 let running=false,progress=0;
 const devices:Device[]=[...ids.map(id=>({id:('part-'+id) as Device['id'],label:'检视 / 拿取 '+partInfo[id].name,root:parts[id].root})),{id:'assembly',label:'组装环境传感器',root:assembly}];
 function take(id:PartId){if(parts[id].state!=='table')return false;parts[id].state='inventory';parts[id].root.visible=false;return true;}
 function putBack(id:PartId){if(running||parts[id].state!=='inventory')return false;const p=parts[id];p.state='table';root.add(p.root);p.root.position.copy(p.home);p.root.rotation.set(0,0,0);p.root.visible=true;return true;}
 function install(id:PartId){if(running||parts[id].state!=='inventory')return false;const p=parts[id];p.state='installed';assembly.add(p.root);p.root.position.set(0,.14,-.2+ids.indexOf(id)*.2);p.root.visible=true;progress=0;return true;}
 function remove(id:PartId){if(running||parts[id].state!=='installed')return false;parts[id].state='inventory';parts[id].root.visible=false;progress=0;return true;}
 function start(){if(running||!ids.every(id=>parts[id].state==='installed'))return false;running=true;progress=0;scanner.visible=true;return true;}
 return {root,parts,assembly,devices,take,putBack,install,remove,start,stop(){running=false;progress=0;scanner.visible=false;},get state(){return {running,progress,complete:progress>=1,parts:Object.fromEntries(ids.map(id=>[id,parts[id].state]))};},update(dt:number,time:number){if(running){progress=Math.min(1,progress+dt/4);if(progress===1)running=false;}scanner.visible=running||progress===1;scanner.rotation.y=time;scanner.scale.setScalar(running?1+Math.sin(time*5)*.1:1);slots.forEach((slot,i)=>(slot.material as THREE.MeshStandardMaterial).emissiveIntensity=parts[ids[i]].state==='installed'?.75:.15);}};
}
