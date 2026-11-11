// All backend calls live here. If the backend is unreachable, a localStorage mock DB takes over so the demo always works.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const MOCK=import.meta.env.VITE_MOCK==='1';
// ⚠ Adjust these paths/payloads to match backend routes in Agarwalvidu/tn_web
export const EP={login:'/api/auth/login',programs:'/api/programs',mentors:'/api/mentors',mentees:'/api/mentees',resources:'/api/resources',submissions:'/api/submissions',grade:'/api/submissions/grade',leaderboard:'/api/leaderboard',aiProfile:'/api/profile/ai'};
export const state={mode:'live'};
async function http(p, m = 'GET', b) {
  const t = localStorage.getItem('tn_token');

  const r = await fetch(BASE + p, {
    method: m,
    headers: {
      'Content-Type': 'application/json',
      ...(t ? { 'x-auth-token': t } : {})
    },
    body: b ? JSON.stringify(b) : undefined
  });

  const j = await r.json().catch(() => ({}));

  if (!r.ok) {
    throw Object.assign(
      new Error(j.message || j.msg || r.statusText),
      { http: 1 }
    );
  }

  return j;
}
async function call(live,mock){if(MOCK){state.mode='mock';return mock()}try{const r=await live();state.mode='live';return r}catch(e){if(e.http)throw e;state.mode='mock';return mock()}}

const D=864e5,KEY='tn_db',uid=()=>Math.random().toString(36).slice(2,8),gpw=()=>Math.random().toString(36).slice(2,10);
const seed=()=>{const n=Date.now(),iso=x=>new Date(n+x).toISOString();return{
programs:[{id:'p1',name:'Web Development',desc:'Build modern web apps with industry best practices.',mentorId:'m1',seats:60},{id:'p2',name:'DSA in C/C++',desc:'Master data structures and algorithms.',mentorId:'m1',seats:50}],
users:[{id:'a1',role:'admin',login:'admin@techneeds.in',pw:'admin123',name:'TechNeeds Admin'},
{id:'m1',role:'mentor',login:'mentor@techneeds.in',pw:'mentor123',name:'Vidushi Agarwal',programIds:['p1','p2']},
{id:'s1',role:'mentee',login:'TN2026001',pw:'tn@1234',name:'Aanya Sharma',programId:'p1',tags:['React','UI/UX']},
{id:'s2',role:'mentee',login:'TN2026002',pw:'tn@1234',name:'Riya Singh',programId:'p1',tags:['Node','DSA']},
{id:'s3',role:'mentee',login:'TN2026003',pw:'tn@1234',name:'Kriti Jain',programId:'p1',tags:['Python']}],
resources:[{id:'r1',programId:'p1',type:'video',title:'HTML & CSS Crash Course',url:'https://youtube.com',deadline:iso(3*D),maxScore:50},
{id:'r2',programId:'p1',type:'quiz',title:'JavaScript Basics Quiz',url:'https://forms.google.com',deadline:iso(5*D),maxScore:100},
{id:'r3',programId:'p1',type:'project',title:'Build a Portfolio Site',url:'',deadline:iso(10*D),maxScore:200},
{id:'r4',programId:'p1',type:'video',title:'Git & GitHub',url:'https://youtube.com',deadline:iso(-D),maxScore:50}],
submissions:[['r1','s1',50],['r2','s1',92],['r1','s2',50],['r4','s2',50],['r1','s3',50],['r4','s1',50]].map(([r,u,s],i)=>({id:'x'+i,resourceId:r,userId:u,score:s,status:'graded',at:iso(-2*D)}))}};
const save=d=>(localStorage.setItem(KEY,JSON.stringify(d)),d);
const db=()=>{try{return JSON.parse(localStorage.getItem(KEY))||save(seed())}catch{return save(seed())}};
const strip=({pw,...u})=>u;
const board=(d,pid)=>d.users.filter(u=>u.role==='mentee'&&(!pid||u.programId===pid)).map(u=>({id:u.id,name:u.name,points:d.submissions.filter(s=>s.userId===u.id&&s.status==='graded').reduce((a,s)=>a+s.score,0)})).sort((a,b)=>b.points-a.points).map((r,i)=>({...r,rank:i+1}));

export function buildProfile(d,id){ // rule-based fallback; backend/LLM version should return the same shape
 const u=d.users.find(x=>x.id===id),rs=d.resources.filter(r=>r.programId===u.programId),ss=d.submissions.filter(s=>s.userId===id),me=board(d,u.programId).find(r=>r.id===id)||{},rank=me.rank||0;
 const by=t=>{const R=rs.filter(r=>r.type===t),S=ss.filter(s=>R.some(r=>r.id===s.resourceId)),g=S.filter(s=>s.status==='graded'),max=g.reduce((a,s)=>a+R.find(r=>r.id===s.resourceId).maxScore,0);return{done:S.length,pct:R.length?Math.round(S.length/R.length*100):0,avg:max?Math.round(g.reduce((a,s)=>a+s.score,0)/max*100):0}};
 const v=by('video'),q=by('quiz'),p=by('project'),early=ss.filter(s=>new Date(s.at)<new Date(rs.find(r=>r.id===s.resourceId)?.deadline)).length;
 const badges=[];if(q.done&&q.avg>=80)badges.push({k:'Quiz Ace',d:'80%+ average on quizzes'});if(early>=2)badges.push({k:'Early Bird',d:'Submits before deadlines'});if(rank&&rank<=3)badges.push({k:'Top 3',d:'On the podium'});if(ss.length>=3)badges.push({k:'Consistent',d:'3+ resources completed'});if(p.done)badges.push({k:'Builder',d:'Shipped a project'});if(!badges.length)badges.push({k:'Rookie',d:'Just getting started'});
 const weak=[['video',v],['quiz',q],['project',p]].sort((a,b)=>a[1].pct-b[1].pct)[0];
 return{name:u.name,tags:u.tags||[],badges,stats:{done:ss.length,total:rs.length,rank,points:me.points||0},
  summary:`${u.name.split(' ')[0]} has completed ${ss.length} of ${rs.length} resources${rank?` and sits at #${rank} on the leaderboard`:''}. ${q.done?`Quiz average is ${q.avg}%. `:''}${u.tags?.length?`Interests: ${u.tags.join(', ')}.`:''}`,
  recs:[`Finish the pending ${weak[0]}s next (${weak[1].pct}% done)`,...(u.tags||[]).slice(0,2).map(t=>`Go deeper on ${t}: build a small project and share it with your mentor`)],
  skills:[{k:'Videos',v:v.pct},{k:'Quizzes',v:q.avg||q.pct},{k:'Projects',v:p.pct},{k:'Punctual',v:ss.length?Math.round(early/ss.length*100):0},{k:'Rank',v:rank?Math.max(10,100-(rank-1)*15):0}]}}

export const api={
 login: (role, id, password) => {
  if (role === 'admin') {
    if (!MOCK) {
      throw new Error(
        'Admin login is currently demo-only. Enable mock mode to use it.'
      );
    }

    return call(
      async () => {},
      () => {
        const u = db().users.find(
          u =>
            u.role === 'admin' &&
            u.login.toLowerCase() === id.trim().toLowerCase() &&
            u.pw === password
        );

        if (!u) throw new Error('Invalid credentials');

        return {
          token: 'mock.' + u.id,
          user: strip(u)
        };
      }
    );
  }

  return call(
    async () => {
      const endpoint =
        role === 'mentor'
          ? '/api/mentors/login'
          : '/api/m/login';

      const payload =
        role === 'mentor'
          ? { email: id.trim(), password }
          : { enrollmentNumber: id.trim(), password };

      const data = await http(endpoint, 'POST', payload);

      const account = data.mentor || data.mentee;

      if (!account || !data.token) {
        throw new Error('Unexpected login response from backend');
      }

      const { _id, password: hiddenPassword, ...safeAccount } = account;
      return {
        token: data.token,
        user: {
          ...safeAccount,
          id: _id,
          role
        }
      };
    },
    () => {
      const u = db().users.find(
        u =>
          u.role === role &&
          u.login.toLowerCase() === id.trim().toLowerCase() &&
          u.pw === password
      );

      if (!u) throw new Error('Invalid credentials');

      return {
        token: 'mock.' + u.id,
        user: strip(u)
      };
    }
  );
},
 programs:()=>call(()=>http(EP.programs),()=>db().programs),
 addProgram:p=>call(()=>http(EP.programs,'POST',p),()=>{const d=db(),x={id:uid(),...p};d.programs.push(x);save(d);return x}),
 mentors:()=>call(()=>http(EP.mentors),()=>db().users.filter(u=>u.role==='mentor').map(strip)),
 addMentor:({name,email,programId})=>call(()=>http(EP.mentors,'POST',{name,email,programId}),()=>{const d=db(),password=gpw(),u={id:uid(),role:'mentor',login:email,pw:password,name,programIds:[programId]};d.users.push(u);const p=d.programs.find(x=>x.id===programId);if(p)p.mentorId=u.id;save(d);return{user:strip(u),login:email,password}}),
 mentees:pid=>call(()=>http(EP.mentees+(pid?`?programId=${pid}`:'')),()=>db().users.filter(u=>u.role==='mentee'&&(!pid||u.programId===pid)).map(strip)),
 addMentee:({name,programId})=>call(()=>http(EP.mentees,'POST',{name,programId}),()=>{const d=db(),password=gpw(),login=`TN${new Date().getFullYear()}${String(d.users.filter(u=>u.role==='mentee').length+1).padStart(3,'0')}`,u={id:uid(),role:'mentee',login,pw:password,name,programId,tags:[]};d.users.push(u);save(d);return{user:strip(u),login,password}}),
 setTags:(id,tags)=>call(()=>http(`${EP.mentees}/${id}`,'PUT',{tags}),()=>{const d=db();d.users.find(u=>u.id===id).tags=tags;save(d);return{ok:1}}),
 resources:pid=>call(()=>http(`${EP.resources}?programId=${pid}`),()=>db().resources.filter(r=>r.programId===pid)),
 addResource:r=>call(()=>http(EP.resources,'POST',r),()=>{const d=db(),x={id:uid(),...r};d.resources.push(x);save(d);return x}),
 submissions:(q={})=>call(()=>http(`${EP.submissions}?${new URLSearchParams(q)}`),()=>{const d=db();return d.submissions.filter(s=>(!q.userId||s.userId===q.userId)&&(!q.programId||d.resources.find(r=>r.id===s.resourceId)?.programId===q.programId))}),
 submit:b=>call(()=>http(EP.submissions,'POST',b),()=>{const d=db(),r=d.resources.find(x=>x.id===b.resourceId);if(new Date(r.deadline)<new Date())throw new Error('Deadline has passed');if(d.submissions.some(s=>s.resourceId===r.id&&s.userId===b.userId))throw new Error('Already submitted');const auto=r.type!=='project';/* demo only: real quiz scoring comes from the backend */const s={id:uid(),resourceId:r.id,userId:b.userId,link:b.link||'',at:new Date().toISOString(),status:auto?'graded':'pending',score:auto?(r.type==='quiz'?Math.round(r.maxScore*(.7+Math.random()*.3)):r.maxScore):0};d.submissions.push(s);save(d);return s}),
 grade:(id,score)=>call(()=>http(EP.grade,'POST',{id,score}),()=>{const d=db(),s=d.submissions.find(x=>x.id===id);s.score=+score;s.status='graded';save(d);return s}),
 leaderboard:pid=>call(()=>http(`${EP.leaderboard}${pid?`?programId=${pid}`:''}`),()=>board(db(),pid)),
 aiProfile:id=>call(()=>http(`${EP.aiProfile}/${id}`),()=>buildProfile(db(),id)),
};
