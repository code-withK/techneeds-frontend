import {NavLink,Outlet,useNavigate} from 'react-router-dom';import Logo from './Brand';import {useAuth} from '../auth';import {state} from '../api';
const NAV={admin:[['/admin','Overview'],['/leaderboard','Leaderboard']],mentor:[['/mentor','My Program'],['/leaderboard','Leaderboard'],['/profile','Profile']],mentee:[['/mentee','Dashboard'],['/profile','AI Profile'],['/leaderboard','Leaderboard']]};
export default function Shell(){const {user,signOut}=useAuth(),nav=useNavigate();
 return <div className="x-shell"><aside className="x-side"><Logo/><nav>{NAV[user.role].map(([to,l])=><NavLink key={to} to={to}>{l}</NavLink>)}</nav>
 <div className="x-user"><b>{user.name}</b><small>{user.role}</small><button className="x-btn ghost" onClick={()=>{signOut();nav('/')}}>Log out</button></div></aside>
 <main className="x-main">{state.mode==='mock'&&<div className="x-banner">Demo mode: backend not reachable, using local sample data.</div>}<Outlet/></main></div>}
