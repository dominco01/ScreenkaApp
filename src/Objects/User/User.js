import React, {  useContext, useEffect, useState } from 'react';
import { getPath } from '../../aFunctions';
import { AuthContext } from '../../Contexts/AuthContext';

const User = ({user_fullname,count=null,onClick, height=32,disabled}) => {
    const {UserService} = useContext(AuthContext)
    const [srcUrl,setSrcUrl] = useState(getPath('default_profile_picture.png'));

    useEffect(()=>{
        if(count==null) UserService.getUserSrcUrl(user_fullname).then(setSrcUrl);
    },[user_fullname])// eslint-disable-line react-hooks/exhaustive-deps

    if(count!=null)
    return ( 
    <span className={'fromdown clickable '+(disabled ? "opacity":"")} >
        <div 
        onClick={(!disabled)?onClick:undefined}
        className={"shadow bcolor-dark-gray text"}
        style={{
            height:height+"px",width:height+"px",
            borderRadius:Math.floor(height/2)+"px"}}>
            
        <span style={{position:'absolute',fontSize:"18px",top:"10px",left:"10px",fontWeight:"bold"}}>
        +{count}
        </span>
        </div>
       
    </span>)

    return ( 
    <span className={'fromdown clickable '+(disabled ? "opacity":"")} >
        <img 
        alt={"user"}
        onClick={(!disabled)?onClick:undefined}
        className={"shadow"}
        style={{
            height:height+"px",width:height+"px",
            borderRadius:Math.floor(height/2)+"px"}}
        src={srcUrl} />
    </span> );
}
 
export default User;