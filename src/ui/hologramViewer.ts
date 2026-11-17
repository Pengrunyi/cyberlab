import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
export function createHologramViewer(host:HTMLElement,source:THREE.Group){
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x061322);const camera=new THREE.PerspectiveCamera(42,1,.1,20);camera.position.set(0,.3,3.5);
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;host.append(renderer.domElement);
 renderer.domElement.setAttribute('aria-label','可拖动旋转、滚轮缩放的全息地球');const controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.minDistance=1.7;controls.maxDistance=6;controls.enableDamping=true;
 let clone=source.clone(true);clone.position.set(0,0,0);scene.add(clone);
 return {sync(){scene.remove(clone);clone=source.clone(true);clone.position.set(0,0,0);scene.add(clone);},update(){const w=host.clientWidth,h=host.clientHeight;if(w<1||h<1)return;if(renderer.domElement.width!==Math.round(w*renderer.getPixelRatio())||renderer.domElement.height!==Math.round(h*renderer.getPixelRatio())){renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}controls.update();renderer.render(scene,camera);},reset(){controls.reset();}};
}
