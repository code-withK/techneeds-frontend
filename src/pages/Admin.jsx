import {useState} from 'react';import {api} from '../api';import {useLoad,Stat,Creds} from '../ui';
export default function Admin(){
 const [pr,rP]=useLoad(api.programs),[mn,rM]=useLoad(api.mentors),[me]=useLoad(()=>api.mentees());
 const [pf,setPf]=useState({name:'',desc:'',seats:50}),[mf,setMf]=useState({name:'',email:'',programId:''}),[cred,setCred]=useState(null),[err,setErr]=useState('');
 const addP=async e=>{e.preventDefault();try{await api.addProgram({...pf,seats:+pf.seats});setPf({name:'',desc:'',seats:50});rP()}catch(x){setErr(x.message)}};
 const addM=async e=>{e.preventDefault();try{setCred(await api.addMentor({...mf,programId:mf.programId||pr?.[0]?.id}));setMf({name:'',email:'',programId:''});rM()}catch(x){setErr(x.message)}};
 return <div><h1>Admin Overview</h1>{err&&<p className="x-err">{err}</p>}
 <div className="x-grid g3"><Stat label="Programs" value={pr?.length??'–'}/><Stat label="Mentors" value={mn?.length??'–'}/><Stat label="Mentees" value={me?.length??'–'}/></div>
 <div className="x-grid g2">
 <form className="x-card x-form" onSubmit={addP}><h3>Create program / cohort</h3><input className="x-in" placeholder="Program name" value={pf.name} onChange={e=>setPf({...pf,name:e.target.value})} required/><input className="x-in" placeholder="Description" value={pf.desc} onChange={e=>setPf({...pf,desc:e.target.value})}/><input className="x-in" type="number" placeholder="Seats" value={pf.seats} onChange={e=>setPf({...pf,seats:e.target.value})}/><button className="x-btn pri">Create program</button></form>
 <form className="x-card x-form" onSubmit={addM}><h3>Onboard mentor</h3><input className="x-in" placeholder="Mentor name" value={mf.name} onChange={e=>setMf({...mf,name:e.target.value})} required/><input className="x-in" type="email" placeholder="Mentor email (login)" value={mf.email} onChange={e=>setMf({...mf,email:e.target.value})} required/><select className="x-in" value={mf.programId} onChange={e=>setMf({...mf,programId:e.target.value})}>{(pr||[]).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select><button className="x-btn pri">Generate credentials</button></form></div>
 {cred&&<Creds c={cred} onClose={()=>setCred(null)}/>}
 <div className="x-card"><h3>Programs</h3><table className="x-tbl"><thead><tr><th>Name</th><th>Description</th><th>Seats</th><th>Mentor</th></tr></thead><tbody>{(pr||[]).map(p=><tr key={p.id}><td>{p.name}</td><td>{p.desc}</td><td>{p.seats}</td><td>{mn?.find(m=>m.id===p.mentorId)?.name||'—'}</td></tr>)}</tbody></table></div>
 <div className="x-card"><h3>Mentors</h3><table className="x-tbl"><tbody>{(mn||[]).map(m=><tr key={m.id}><td>{m.name}</td><td>{m.login}</td></tr>)}</tbody></table></div></div>}
