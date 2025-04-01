import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';
import { BottomTabProvider } from '../../Contexts/BottomTabContext';
import Home from './home/Home';
import "./Start.css"
import AboutWeek from './about-week/AboutWeek';

const Start = () => {
    const navigate = useNavigate();

    const {user} = useContext(AuthContext)

    const [aboutToggled,setAboutToggled] = useState(false);
    const [aboutToggledDelay,setAboutToggledDelay] = useState(false);

    useEffect(()=>{
      const timeout = setTimeout(()=>{
        setAboutToggledDelay(aboutToggled);
      },200)
      return ()=>clearTimeout(timeout);
    },[aboutToggled])

    useEffect(()=>{
        if(user==null) {navigate("/login",{replace:true});return;}
    },[user])

    return ( 
        <div className='start'>
          <BottomTabProvider>
          <div className="start-pages" style={(aboutToggledDelay && aboutToggled)?{transform:"translateX(-50%)"}:{}}>
            <div>
              {user && <Home onAboutWeekClick={()=>setAboutToggled(true)}/>}
            </div>
            <div>
              { (aboutToggled || aboutToggledDelay) && <AboutWeek onClose={()=>setAboutToggled(false)}/>}
            </div>
            
        </div>
        </BottomTabProvider>
        </div>
     );
}
 
export default Start;