import {useEffect} from 'react';import {api} from '../api';import {useAuth} from '../auth';import {useLoad} from '../ui';import Avatar from '../components/Avatar';
export default function Leaderboard(){const {user}=useAuth(),[rows,reload]=useLoad(()=>api.leaderboard(user.programId));
 useEffect(()=>{const t=setInterval(reload,15000);return()=>clearInterval(t)},[reload]); // live refresh every 15 s
 if(!rows)return <p className="muted">Loading…</p>;const top=[rows[1],rows[0],rows[2]].filter(Boolean);
 return <div><h1>Leaderboard <small className="live">● live</small></h1>
 <div className="x-podium">{top.map(r=><div key={r.id} className={`x-pod p${r.rank}`}><Avatar seed={r.name} size={r.rank===1?84:64}/><b>{r.name}</b><small>{r.points} pts</small><div className="bar">{r.rank}</div></div>)}</div>
 <div className="x-card"><table className="x-tbl"><thead><tr><th>Rank</th><th>Name</th><th>Points</th></tr></thead><tbody>{rows.map(r=><tr key={r.id} className={r.id===user.id?'me':''}><td>#{r.rank}</td><td>{r.name}</td><td>{r.points}</td></tr>)}</tbody></table></div></div>}
