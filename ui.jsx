import {useState,useEffect,useCallback} from 'react';
export const fmt=d=>new Date(d).toLocaleString([],{dateStyle:'medium',timeStyle:'short'});
export const left=d=>{const ms=new Date(d)-Date.now();if(ms<0)return'Overdue';const h=Math.floor(ms/36e5);return h>=48?`${Math.floor(h/24)} days left`:`${h}h left`};
export function useLoad(fn,deps=[]){const [data,set]=useState(null);const run=useCallback(()=>fn().then(set).catch(()=>set([])),deps);useEffect(()=>{run()},[run]);return [data,run]}
export const Stat=({label,value})=><div className="x-card x-stat"><small>{label}</small><b>{value}</b></div>;
export function Creds({c,onClose}){return <div className="x-card x-creds"><b>Credentials for {c.user.name}</b><p>Login: <code>{c.login}</code> · Password: <code>{c.password}</code></p><small>Shown only once — share it securely.</small><div><button className="x-btn" onClick={()=>navigator.clipboard?.writeText(`Login: ${c.login}\nPassword: ${c.password}`)}>Copy</button>{onClose&&<button className="x-btn ghost" onClick={onClose}>Dismiss</button>}</div></div>}
