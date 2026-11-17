import * as THREE from 'three';
import {box,metal,dark,neon,label} from '../objects/primitives';
export function createRoom(scene: THREE.Scene) {
  const room=new THREE.Group();room.name='Laboratory architecture';scene.add(room);
  const floor=new THREE.MeshStandardMaterial({color:0x152530,metalness:.65,roughness:.3});
  box(room,[14,.25,12],[0,-.125,0],floor);
  for(let x=-6;x<=6;x+=2)for(let z=-5;z<=5;z+=2){box(room,[1.96,.012,1.96],[x,.008,z],floor);}
  const grid=new THREE.GridHelper(14,14,0x28434a,0x253b45);grid.position.y=.019;grid.scale.z=12/14;room.add(grid);
  box(room,[14,5,.25],[0,2.5,-6]);box(room,[.25,5,12],[-7,2.5,0]);
  // Rear panorama replaces the opaque rear wall. The upper slab leaves a lift shaft.
  box(room,[11,.22,12],[-1.5,4.89,0],floor);
  box(room,[3,.22,9.2],[5.5,4.89,-1.4],floor);
  box(room,[.35,.22,2.8],[6.825,4.89,4.6],floor);
  const glass=new THREE.MeshPhysicalMaterial({color:0x8baeb8,transparent:true,opacity:.055,roughness:.16,metalness:.15,depthWrite:false,side:THREE.DoubleSide});
  for(const level of [0,5]){
   box(room,[13.6,4.35,.035],[0,level+2.4,6],glass);
   for(const x of [-6.8,-3.5,0,3.5,6.8])box(room,[.09,4.8,.2],[x,level+2.4,5.98]);
   for(const y of [.12,4.72]){box(room,[13.6,.16,.2],[0,level+y,5.96]);box(room,[13.3,.025,.025],[0,level+y+.1,5.83],neon(0x6fcdd6,.7));}
  }
  box(room,[14,.2,12],[0,9.6,0]);
  box(room,[14,4.6,.25],[0,7.3,-6]);box(room,[.25,4.6,12],[-7,7.3,0]);
  box(room,[.035,4.4,11.7],[6.94,7.3,0],glass);
  for(const z of [-6,-3,3,6])box(room,[.15,4.6,.09],[6.8,7.3,z]);
  for(const z of [-4,0,4]){box(room,[13.6,.16,.16],[0,9.4,z]);box(room,[6,.025,.06],[0,9.28,z],neon(0xffc28b,.6));}
  for(let x=-6;x<=6;x+=2){box(room,[1.9,3.7,.08],[x,2.3,-5.84],dark);box(room,[.05,4.5,.15],[x-1,2.5,-5.68]);}
  for(let z=-5;z<=5;z+=2){box(room,[.06,4,1.94],[-6.84,2.5,z],dark);box(room,[.2,.14,1.7],[-6.7,3.9,z],neon(0x418dff,1));}
  for(const x of [-6.7,6.7]){box(room,[.08,.07,11.7],[x,.13,0],neon());box(room,[.16,.16,12],[x,4.75,0]);}
  box(room,[13.5,.07,.06],[0,.13,-5.72],neon());
  // Glazing is a faint tint; the city remains legible through it.
  box(room,[.04,4.35,11.6],[6.94,2.5,0],new THREE.MeshPhysicalMaterial({color:0x85a9c1,transparent:true,opacity:.025,roughness:.14,metalness:.1,depthWrite:false}));
  for(const z of [-6,-3,3,6])box(room,[.18,5,.09],[6.8,2.5,z]);
  box(room,[.22,.18,12],[6.8,.4,0]);box(room,[.22,.18,12],[6.8,4.7,0]);
  for(let z=-5;z<=5;z+=3.5){box(room,[14,.22,.24],[0,4.85,z]);box(room,[8,.035,.09],[0,4.71,z],neon(0x97d8ff,2));}
  // Architectural light and floor markings frame the central circulation aisle.
  for(const x of [-1.4,1.4])box(room,[.035,.016,6.4],[x,.03,1.5],neon(0x28b5aa,.65));
  for(let z=1;z<5;z+=.45){const m=box(room,[.5,.02,.07],[-4.9,.035,z],neon(0xd1a768,.4));m.rotation.y=-.6;}
  label(room,'CYBERLAB',3.8,[-3.8,3.95,-5.65]);label(room,'RESEARCH DIVISION / 07',2.9,[-3.8,3.5,-5.65],'#6e9da8');
  label(room,'AUTHORIZED PERSONNEL',2.5,[2.9,4.1,-5.65],'#7a92a8');
  box(room,[1.6,2.9,.16],[5.2,1.5,-5.65],dark);box(room,[.04,2.8,.04],[4.4,1.5,-5.54],neon(0x9974ff));
  label(room,'07',.8,[4.8,2.3,-5.53],'#9c88dc');
  return room;
}
