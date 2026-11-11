import {useEffect,useRef} from 'react';import * as THREE from 'three';
export default function Globe3D(){const ref=useRef();useEffect(()=>{
 const el=ref.current,R=new THREE.WebGLRenderer({canvas:el,antialias:true,alpha:true});R.setPixelRatio(Math.min(devicePixelRatio,2));
 const S=new THREE.Scene(),cam=new THREE.PerspectiveCamera(42,1,.1,100);cam.position.z=8.5;const G=new THREE.Group();S.add(G);
 G.add(new THREE.Mesh(new THREE.SphereGeometry(2,48,48),new THREE.MeshBasicMaterial({color:0x0a0618})));
 const N=3000,P=new Float32Array(N*3),C=new Float32Array(N*3),pu=new THREE.Color(0xa855f7),gr=new THREE.Color(0x43f58a);
 for(let i=0;i<N;i++){const y=1-2*(i+.5)/N,r=Math.sqrt(1-y*y),a=i*2.39996,x=Math.cos(a)*r,z=Math.sin(a)*r;P.set([x*2.02,y*2.02,z*2.02],i*3);(Math.sin(x*3)+Math.cos(y*4)+Math.sin(z*3.5)>1.1?gr:pu).toArray(C,i*3)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(P,3));g.setAttribute('color',new THREE.BufferAttribute(C,3));
 G.add(new THREE.Points(g,new THREE.PointsMaterial({size:.04,vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false})));
 G.add(new THREE.Mesh(new THREE.SphereGeometry(2.3,48,48),new THREE.MeshBasicMaterial({color:0x7c3aed,transparent:true,opacity:.1,side:THREE.BackSide,blending:THREE.AdditiveBlending})));
 const sats=[];[[3.1,1.2,0xa855f7,.6],[3.6,.5,0x43f58a,-.45],[4.1,-.8,0xc084fc,.3]].forEach(([r,t,c,v])=>{const pv=new THREE.Group();pv.rotation.set(t,0,t*.5);pv.add(new THREE.Mesh(new THREE.TorusGeometry(r,.011,8,220),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.75})));const s=new THREE.Mesh(new THREE.SphereGeometry(.09,16,16),new THREE.MeshBasicMaterial({color:0xffffff}));pv.add(s);sats.push({s,r,v,o:Math.random()*6});G.add(pv)});
 const cube=new THREE.Mesh(new THREE.IcosahedronGeometry(.5,0),new THREE.MeshBasicMaterial({color:0xc084fc,wireframe:true}));cube.position.set(-3.2,1.7,1);S.add(cube);
 let mx=0,my=0;const mv=e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5};addEventListener('mousemove',mv);
 const fit=()=>{const w=el.clientWidth,h=el.clientHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()};fit();addEventListener('resize',fit);
 const clk=new THREE.Clock();let raf;const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const loop=()=>{const t=clk.getElapsedTime();G.rotation.y=t*.12+mx*.6;G.rotation.x=my*.3+.15;sats.forEach(o=>{const a=t*o.v+o.o;o.s.position.set(Math.cos(a)*o.r,Math.sin(a)*o.r,0)});cube.rotation.x=t*.4;cube.rotation.y=t*.6;cube.position.y=1.7+Math.sin(t)*.3;R.render(S,cam);if(!reduce)raf=requestAnimationFrame(loop)};loop();
 return()=>{cancelAnimationFrame(raf);removeEventListener('mousemove',mv);removeEventListener('resize',fit);R.dispose()}},[]);
 return <canvas ref={ref} className="g3d"/>}
