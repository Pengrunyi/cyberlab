import * as THREE from 'three';
export function createLighting(scene: THREE.Scene) {
  scene.add(new THREE.HemisphereLight(0x7fa8d0,0x172a37,1.3));
  const main=new THREE.SpotLight(0xb9e0ff,160,22,Math.PI/2.8,.8,1.5);main.position.set(0,4.6,1);main.target.position.set(0,0,-1);main.castShadow=true;main.shadow.mapSize.set(1024,1024);main.shadow.bias=-.001;scene.add(main,main.target);
  const accent=new THREE.PointLight(0x4dffe3,28,10,1.6);accent.position.set(-4,2.5,-3);scene.add(accent);
  const purple=new THREE.PointLight(0x9cbfe0,35,6,1.6);purple.position.set(2.4,3.9,-2.9);scene.add(purple);
  const windowLight=new THREE.DirectionalLight(0x5983db,2);windowLight.position.set(10,6,-2);scene.add(windowLight);
  main.intensity=95;accent.intensity=18;purple.intensity=15;windowLight.intensity=.8;
  return {set(color: string,brightness:number,on:boolean){accent.color.set(color);accent.intensity=on?18*brightness:0;main.intensity=on?95*brightness:0;purple.intensity=on?15*brightness:2;}};
}
