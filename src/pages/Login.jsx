import {useState} from 'react';import {useNavigate,Link} from 'react-router-dom';import {api} from '../api';import {useAuth,HOME} from '../auth';import Logo from '../components/Brand';
const ROLES=['admin','mentor','mentee'];
export default function Login(){const [role,setRole]=useState('mentee'),[id,setId]=useState(''),[pw,setPw]=useState(''),[err,setErr]=useState(''),[busy,setBusy]=useState(false);const {signIn}=useAuth(),nav=useNavigate();
 const go=async e=>{e.preventDefault();setBusy(true);setErr('');try{const r=await api.login(role,id,pw);signIn(r);nav(HOME[r.user.role])}catch(x){setErr(x.message)}setBusy(false)};
 return <div className="x-login"><form className="x-card x-lbox" onSubmit={go}><Logo/><h2>Welcome back</h2>
 <div className="x-tabs">{ROLES.map(r=><button type="button" key={r} className={role===r?'on':''} onClick={()=>setRole(r)}>{r}</button>)}</div>
 <input className="x-in" placeholder={role==='mentee'?'Enrollment Number':'Email'} value={id} onChange={e=>setId(e.target.value)} required/>
 <input className="x-in" type="password" placeholder="Password" value={pw} onChange={e=>setPw(e.target.value)} required/>
 {err&&<p className="x-err">{err}</p>}<button className="x-btn pri" disabled={busy}>{busy?'Signing in…':'Sign in'}</button>
 <small className="muted">Demo (offline mode): admin@techneeds.in / admin123 · mentor@techneeds.in / mentor123 · TN2026001 / tn@1234</small>
 <Link to="/" className="muted">← Back to home</Link></form></div>}
