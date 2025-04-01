import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import AuthProvider from "./AuthContext";
import { DEMOFUNNYNAME } from '../Services/aDemobase';

export const AuthContextWithDemo = ({ children,onDemo }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isDemo = useRef(location.pathname.startsWith("/demo"));

    useEffect(()=>{ if(isDemo.current) {
        onDemo();
        const timeout = setTimeout(()=>{
            localStorage.setItem("funnyname",DEMOFUNNYNAME)
        },500)
        return ()=>clearTimeout(timeout);
    } },[]) //eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (isDemo.current && !location.pathname.startsWith("/demo"))
            navigate(`/demo${location.pathname}`,{replace:true, state: location.state}); 
    }, [navigate,location.pathname]);

    return !isDemo.current 
    ? 
        <AuthProvider>
            {children}
        </AuthProvider>
    :
        <AuthProvider demo>
            {children}
            <h2 className='noselect' style={{position:"fixed",left:"10px",top:"13px",margin:0,opacity:"0.3",zIndex:-10}}>DEMO</h2>
        </AuthProvider>    
  };