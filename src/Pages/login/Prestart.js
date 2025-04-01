import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TempLogin from './templogin/TempLogin';
import Setup from './setup/Setup';

const Prestart = () => {
    
    const navigate = useNavigate();
    const [isNext,setIsNext] = useState(false)

    return ( 
    <div>
        {!isNext && <TempLogin onTempLogin={()=>setIsNext(true)}/>}
        {isNext && <Setup onSetup={()=>{navigate("/",{replace:true});}}/>}
    </div> );
}
 
export default Prestart;