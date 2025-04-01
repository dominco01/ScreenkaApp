import React, {  useContext, useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import InputField from '../../../Components/InputField';
import { AuthContext } from '../../../Contexts/AuthContext';
import "./TempLogin.css"
import { getPath } from '../../../aFunctions';
import { MultipleError } from '../../../Services/aFirebase';

const TempLogin = ({onTempLogin}) => {

    const {user,UserService} = useContext(AuthContext);

    const [meSrc,setMeSrc] = useState(getPath("default_profile_picture.png"))
    const inputRef = useRef();

    const [isInputFieldRed,setIsInputFieldRed] = useState(false);
    const [isInputFieldLoading,setIsInputFieldLoading] = useState(false);

    useEffect(()=>{

        const timeout = setTimeout(()=>{

            inputRef.current.value=localStorage.getItem("funnyname");
            
            if(user) UserService.getUserSrcUrl(user.fullname).then(setMeSrc);
        
        },500);
    
        return ()=> clearTimeout(timeout);
           
    },[])// eslint-disable-line react-hooks/exhaustive-deps

    const handleOnEnter = async () => {
        setIsInputFieldLoading(true)
        
        UserService.tryLogMeInTemporarly(inputRef.current.value)
            .then(res=>{
                setIsInputFieldRed(!res);
                if(res) onTempLogin();  })
            .catch(err=>{
                if(err instanceof MultipleError) window.alert("Multiple users with same username. Contact the host.");
                else window.alert(err.message);
            })
            .then(()=>setIsInputFieldLoading(false))
       };

    return ( 
        <div style={{height:"100%", display:"flex", flexDirection:"column"}}>
    <div className='login flex-center'>
            <div className='login-user'>
                <img src={meSrc} alt="profile"/>
                <div>
                    <h4>Enter Secret Name:</h4>
                    <InputField autofocus reff={inputRef} onEnter={handleOnEnter} isRed={isInputFieldRed} isLoading={isInputFieldLoading} />
                </div>
            </div>
            
        </div> 
        <footer className='center'>Tip: Click enter while typing</footer>
        </div>
   );
}
 
export default TempLogin;