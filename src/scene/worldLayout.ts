import * as THREE from 'three';

// One fixed coordinate system: east window +X, south window +Z, vertical +Y.
// Track and all rolling stock consume this exact path, measured in metres.
const points:THREE.Vector3[]=[];
for(let z=-440;z<=46;z+=6)points.push(new THREE.Vector3(20,-18,z));
for(let i=1;i<=36;i++){
 const a=i/36*Math.PI/2;
 points.push(new THREE.Vector3(-34+54*Math.cos(a),-18,46+54*Math.sin(a)));
}
for(let x=-40;x>=-550;x-=6)points.push(new THREE.Vector3(x,-18,100));
export const railPath=new THREE.CatmullRomCurve3(points,false,'centripetal');
railPath.arcLengthDivisions=1600;
export const railLength=railPath.getLength();
const sampleCount=Math.ceil(railLength/2)+1;
export const railSamples=Array.from({length:sampleCount},(_,i)=>railPath.getPointAt(i/(sampleCount-1)));
export interface BuildingFootprint {x:number;z:number;minX:number;maxX:number;minZ:number;maxZ:number;top:number}
export function railClear(minX:number,maxX:number,minZ:number,maxZ:number,clearance=6){
 return !railSamples.some(p=>p.x>minX-clearance&&p.x<maxX+clearance&&p.z>minZ-clearance&&p.z<maxZ+clearance);
}
export function footprintsOverlap(a:BuildingFootprint,b:BuildingFootprint,gap=1.6){
 return a.minX<b.maxX+gap&&a.maxX>b.minX-gap&&a.minZ<b.maxZ+gap&&a.maxZ>b.minZ-gap;
}
