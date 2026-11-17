import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

// A single lazy preview context is reused for both objects and the city map.
export function createResearchViewer(host:HTMLElement){
 const scene=new THREE.Scene();scene.background=new THREE.Color(0x071725);
 scene.add(new THREE.HemisphereLight(0xd9faff,0x38455e,3));const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(3,5,4);scene.add(light);
 const camera=new THREE.PerspectiveCamera(42,1,.01,100);camera.position.set(2,2,3);
 const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;host.append(renderer.domElement);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=.4;controls.maxDistance=12;
 const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let content:THREE.Object3D|undefined,downX=0,downY=0;
 renderer.domElement.setAttribute('aria-label','拖动旋转、滚轮缩放的三维检视窗口');renderer.domElement.tabIndex=0;
 return {camera,controls,set(object:THREE.Object3D,overview=false){if(content)scene.remove(content);content=object;scene.add(content);controls.target.set(0,0,0);camera.position.set(1.6,1.1,2.8);if(overview){const bounds=new THREE.Box3().setFromObject(object),sphere=bounds.getBoundingSphere(new THREE.Sphere());controls.target.copy(sphere.center);camera.position.copy(sphere.center).add(new THREE.Vector3(1,1.3,1).normalize().multiplyScalar(sphere.radius*3.2));controls.maxDistance=sphere.radius*8;}else controls.maxDistance=12;controls.update();controls.saveState();},reset(){controls.reset();},pick(fn:(hit:THREE.Intersection|undefined)=>void){renderer.domElement.onpointerdown=e=>{downX=e.clientX;downY=e.clientY;};renderer.domElement.onclick=e=>{if(Math.hypot(e.clientX-downX,e.clientY-downY)>6||!content)return;const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,camera);fn(ray.intersectObject(content,true)[0]);};},update(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;const ratio=renderer.getPixelRatio();if(renderer.domElement.width!==Math.round(w*ratio)||renderer.domElement.height!==Math.round(h*ratio)){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}controls.update();renderer.render(scene,camera);}};
}
