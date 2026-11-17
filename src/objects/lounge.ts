import * as THREE from 'three';
import {box,metal,dark,neon} from './primitives';
export function createLounge(scene:THREE.Scene){
 const g=new THREE.Group();g.name='Window lounge';scene.add(g);
 const fabric=new THREE.MeshStandardMaterial({color:0x20232f,roughness:.93,metalness:.02});
 box(g,[3.3,.35,1.5],[-2.25,.35,4.55],dark);
 box(g,[3.3,.85,.28],[-2.25,.85,5.18],fabric);
 for(const x of [-3.77,-.73])box(g,[.26,.65,1.4],[x,.65,4.5],fabric);
 for(let i=0;i<3;i++)box(g,[.9,.2,1.1],[-3.25+i,.64,4.44],fabric);
 box(g,[3,.025,.025],[-2.25,.21,3.8],neon(0x4ea6cf,.5));
 box(g,[1.6,.07,.9],[-2.25,.55,2.7],metal);
 for(const x of [-2.85,-1.65])box(g,[.05,.5,.7],[x,.27,2.7],dark);
 box(g,[.35,.02,.25],[-2.1,.6,2.65],neon(0x5ba9d4,.5));
 return {root:g};
}
