import React from 'react';import {createRoot} from 'react-dom/client';import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';
import './styles.css';import './app.css';import {AuthProvider,Guard} from './auth';import Shell from './components/Shell';
import Landing from './pages/Landing';import Login from './pages/Login';import Admin from './pages/Admin';import Mentor from './pages/Mentor';import Mentee from './pages/Mentee';import Leaderboard from './pages/Leaderboard';import Profile from './pages/Profile';
createRoot(document.getElementById('root')).render(<BrowserRouter><AuthProvider><Routes>
 <Route path="/" element={<Landing/>}/><Route path="/login" element={<Login/>}/>
 <Route element={<Guard><Shell/></Guard>}>
  <Route path="/admin" element={<Guard roles={['admin']}><Admin/></Guard>}/><Route path="/mentor" element={<Guard roles={['mentor']}><Mentor/></Guard>}/><Route path="/mentee" element={<Guard roles={['mentee']}><Mentee/></Guard>}/>
  <Route path="/leaderboard" element={<Leaderboard/>}/><Route path="/profile" element={<Guard roles={['mentor','mentee']}><Profile/></Guard>}/></Route>
 <Route path="*" element={<Navigate to="/"/>}/></Routes></AuthProvider></BrowserRouter>);
