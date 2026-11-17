import * as THREE from 'three';
import {box,cylinder,screen,metal,dark,silver,neon,label} from './primitives';
export function createEquipment(scene:THREE.Scene){
 const g=new THREE.Group();scene.add(g);g.name='Control wall and experiment bench';
 const control=screen(g,'LABORATORY OVERVIEW',[2.5,1.28],[.25,3.15,-5.65],1);
 const indicators=Array.from({length:4},(_,i)=>box(g,[.17,.07,.07],[-.5+i*.45,2.4,-5.5],neon(0x58d7b5,.8)));
 for(let i=0;i<3;i++){
  box(g,[.75,1.45,.75],[-.6+i*.85,.74,-5.15],dark);
  for(let y=0;y<8;y++){box(g,[.6,.09,.04],[-.6+i*.85,.25+y*.14,-4.75]);box(g,[.035,.035,.02],[-.82+i*.85,.25+y*.14,-4.72],neon(y%3?0x35e0c2:0xa47aff,1));}
 }
 const bench=new THREE.Group();bench.position.set(-5.6,0,.5);bench.rotation.y=Math.PI/2;g.add(bench);
 box(bench,[3.6,.16,1.25],[0,1,0]);for(const x of [-1.4,1.4])box(bench,[.12,.95,1],[x,.48,0]);
 screen(bench,'SENSOR ARRAY',[.9,.65],[-.8,1.58,-.3],1);
 box(bench,[.6,.28,.45],[.55,1.24,.15],dark);box(bench,[.6,.055,.46],[.55,1.4,.15],silver);box(bench,[.22,.055,.1],[.55,1.46,.15]);
 for(let i=0;i<3;i++){cylinder(bench,.09,.27,[1.1+i*.17,1.24,-.3],silver);cylinder(bench,.075,.03,[1.1+i*.17,1.39,-.3],neon(0x4de7d0));}
 label(bench,'EXPERIMENT / 04',1.5,[-1.65,.75,.65]);
 // Wall-mounted storage, pipes and cable conduits.
 for(let z=0;z<3;z++){box(g,[.3,.3,2.1],[-6.5,3.1+z*.36,.5]);for(let i=0;i<5;i++)box(g,[.36,.2,.22],[-6.3,3.1+z*.36,-.25+i*.34],i%2?silver:dark);}
 for(const x of [-6.5,-6.1]){const pipe=cylinder(g,.055,4.3,[x,2.2,-3],silver);pipe.rotation.z=.03;}
 return {root:g,control,setDiagnostic(step:number|undefined){indicators.forEach((lamp,i)=>{const m=lamp.material as THREE.MeshStandardMaterial;const color=step===undefined||i<step?0x58d7b5:0x714988;m.color.setHex(color);m.emissive.setHex(color);m.emissiveIntensity=step===undefined?.8:i===step?2:.8;});}};
}
