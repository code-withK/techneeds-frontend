import {createContext,useContext,useState} from 'react';import {Navigate} from 'react-router-dom';
const Ctx=createContext(null);export const useAuth=()=>useContext(Ctx);
export const HOME={admin:'/admin',mentor:'/mentor',mentee:'/mentee'};
export function AuthProvider({children}){
 const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('tn_user'))}catch{return null}});
 const signIn=({token,user})=>{localStorage.setItem('tn_token',token);localStorage.setItem('tn_user',JSON.stringify(user));setUser(user)};
 const signOut=()=>{localStorage.removeItem('tn_token');localStorage.removeItem('tn_user');setUser(null)};
 return <Ctx.Provider value={{user,signIn,signOut}}>{children}</Ctx.Provider>}
export function Guard({roles,children}){const {user}=useAuth();if(!user)return <Navigate to="/login" replace/>;if(roles&&!roles.includes(user.role))return <Navigate to={HOME[user.role]} replace/>;return children}
