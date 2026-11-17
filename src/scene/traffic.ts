import * as THREE from 'three';
import {box,neon} from '../objects/primitives';
import {buildBatch,type Part} from './cityBatch';
import {railPath,railLength,railSamples} from './worldLayout';

// Geometry and vehicles share one continuous, metre-based alignment around the lab.
export function createTraffic(parent:THREE.Object3D){
 const root=new THREE.Group();root.name='Shared east–south railway';parent.add(root);
 const metal=new THREE.MeshStandardMaterial({color:0x253b48,metalness:.7,roughness:.38});
 const cyan=neon(0x65cbd1,.8),amber=neon(0xe5ac73,.7);
 for(const offset of [-1.4,1.4]){
  const points=railSamples.map((p,i)=>{
   const t=railPath.getTangentAt(i/(railSamples.length-1));
   return p.clone().add(new THREE.Vector3(t.z,0,-t.x).multiplyScalar(offset));
  });
  const curve=new THREE.CatmullRomCurve3(points);
  const rail=new THREE.Mesh(new THREE.TubeGeometry(curve,650,.13,5,false),metal);rail.name='Continuous running rail';root.add(rail);
 }
 const sleepers:Part[]=[],supports:Part[]=[];
 for(let d=0;d<railLength;d+=3.5){
  const p=railPath.getPointAt(d/railLength);
  // Batch rotations are around Z; horizontal sleepers need a world Y rotation.
  sleepers.push({position:p.toArray(),size:[1,1,1]});
 }
 const ties=new THREE.InstancedMesh(new THREE.BoxGeometry(4.2,.28,.4),metal,sleepers.length),dummy=new THREE.Object3D();ties.name='Railway sleepers';
 sleepers.forEach((s,i)=>{const t=railPath.getTangentAt((i*3.5)/railLength);dummy.position.set(s.position[0],s.position[1]-.25,s.position[2]);dummy.rotation.y=Math.atan2(t.x,t.z);dummy.updateMatrix();ties.setMatrixAt(i,dummy.matrix);});root.add(ties);
 for(let d=10;d<railLength;d+=28){const p=railPath.getPointAt(d/railLength);supports.push({position:[p.x,-66,p.z],size:[1.2,94,1.2]});}
 buildBatch(root,'Grounded viaduct supports',supports,metal);
 const deck=new THREE.Mesh(new THREE.TubeGeometry(railPath,650,.65,4,false),metal);deck.position.y=-1.1;deck.name='Continuous structural track spine';root.add(deck);
 const cars:THREE.Group[]=[];
 for(let i=0;i<4;i++){
  const car=new THREE.Group();car.name=`Shared railway / car ${i+1}`;root.add(car);cars.push(car);
  box(car,[2.7,2.7,7.2],[0,1.65,0],metal);
  box(car,[2.4,.4,6.8],[0,3.15,0],metal);
  for(const side of [-1,1]){
   box(car,[.04,.15,6.9],[side*1.37,.8,0],cyan);
   for(let z=-2.5;z<=2.5;z+=1.25)box(car,[.04,.9,.9],[side*1.37,2.1,z],cyan);
   for(const z of [-2.4,2.4])box(car,[.35,.5,.8],[side*1.05,.05,z],metal);
  }
  box(car,[2.1,.9,.04],[0,2.05,3.63],cyan);
  for(const x of [-.85,.85])box(car,[.25,.18,.05],[x,.85,3.65],i===0?amber:cyan);
 }
 // Air lanes remain above the highest local roofs; no interior or building crossings.
 const flyers:THREE.Group[]=[];
 for(let i=0;i<6;i++){
  const craft=new THREE.Group();craft.name='High altitude air traffic';root.add(craft);flyers.push(craft);
  box(craft,[2,.7,4],[0,0,0],metal);box(craft,[4,.15,1.2],[0,0,-.7],metal);
  box(craft,[1.3,.2,.08],[0,0,-2.05],i%2?amber:cyan);
 }
 const up=new THREE.Vector3(0,1,0);
 return (time:number)=>{
  const head=35+((time*14)%(railLength-40));
  cars.forEach((car,i)=>{
   const d=head-i*8;car.visible=d>=0&&d<=railLength;if(!car.visible)return;
   const p=railPath.getPointAt(d/railLength),t=railPath.getTangentAt(d/railLength);
   car.position.copy(p);car.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(up.clone().cross(t).normalize(),up,t));
  });
  flyers.forEach((craft,i)=>{craft.position.set(150+i*55,120+i*13,((time*(12+i*2)+i*155)%1400)-700);});
 };
}
