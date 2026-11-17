import * as THREE from 'three';
export interface Part {position:number[];size:number[];color?:number;rotation?:number}
export function buildBatch(parent:THREE.Object3D,name:string,parts:Part[],material:THREE.Material,geometry:THREE.BufferGeometry=new THREE.BoxGeometry(1,1,1)){
 const mesh=new THREE.InstancedMesh(geometry,material,parts.length);
 mesh.name=name;const dummy=new THREE.Object3D();const color=new THREE.Color();
 parts.forEach((p,i)=>{dummy.position.set(p.position[0],p.position[1],p.position[2]);dummy.scale.set(p.size[0],p.size[1],p.size[2]);dummy.rotation.set(0,0,p.rotation??0);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);if(p.color!==undefined)mesh.setColorAt(i,color.set(p.color));});
 mesh.computeBoundingSphere();parent.add(mesh);return mesh;
}
