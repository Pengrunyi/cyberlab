import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
export function createRenderer(scene:THREE.Scene,camera:THREE.Camera,host:HTMLElement){
 const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.98;host.prepend(renderer.domElement);
 const composer=new EffectComposer(renderer);const renderPass=new RenderPass(scene,camera);composer.addPass(renderPass);const bloom=new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.27,.55,1.15);composer.addPass(bloom);composer.addPass(new OutputPass());
 renderer.info.autoReset=false;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
 return {renderer,setCamera(camera:THREE.Camera){renderPass.camera=camera;},render(){renderer.info.reset();composer.render();},resize(){renderer.setSize(innerWidth,innerHeight);composer.setPixelRatio(renderer.getPixelRatio());composer.setSize(innerWidth,innerHeight);},quality(high:boolean){bloom.enabled=high;renderer.setPixelRatio(high?Math.min(devicePixelRatio,1.5):1);this.resize();}};
}
