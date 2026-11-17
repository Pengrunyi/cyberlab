export function createTerminal(onComplete:(mode:number)=>void){
 const logs=['CYBERLAB OS 3.0 / LOCAL SIMULATION','> boot complete. 5 devices connected.','> ready for operator input_'];
 let jobs:{time:number;text:string}[]=[],elapsed=0,mode=0,running=false;let changed=()=>{};
 const append=(line:string)=>{logs.push(line);if(logs.length>45)logs.shift();changed();};
 return {logs,get running(){return running;},subscribe(fn:()=>void){changed=fn;},run(kind:'scan'|'diagnose'|'screen'){
  if(running)return;running=true;elapsed=0;mode=kind==='scan'?0:kind==='diagnose'?1:2;
  const lines=kind==='scan'?['> scanning local virtual network...','NODE 01 / TERMINAL       12 ms / ONLINE','NODE 02 / HOLO CORE       8 ms / ONLINE','NODE 03 / ROBOT ARM      16 ms / ONLINE','NODE 04 / LIGHTING        4 ms / ONLINE','NODE 05 / WEATHER GRID  SIMULATION','> scan complete. All local links healthy.']:kind==='diagnose'?['> starting device self-test...','LIGHT BUS ............. PASS','ARM JOINT LIMITS ...... PASS','HOLOGRAPHIC ARRAY ..... PASS','ENVIRONMENT SENSORS ... PASS','> diagnostics complete. No faults detected.']:['> switching workspace screens...','> three displays synchronized.'];
  append('');jobs=lines.map((text,i)=>({time:(i+1)*.35,text}));
 },update(dt:number){if(!running)return;elapsed+=dt;while(jobs.length&&elapsed>=jobs[0].time)append(jobs.shift()!.text);if(!jobs.length){running=false;onComplete(mode);changed();}},clear(){if(!running){logs.splice(0,logs.length,'> terminal cleared. Ready_');changed();}}};
}
