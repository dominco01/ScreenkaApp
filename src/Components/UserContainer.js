import React from 'react';
import "./styles/Containers.css"
import User from '../Objects/User/User';

const UserContainer = ({
    user_fullnames, more=0,
    userHeight=30,onUserClick=()=>{}, userClassName="",
    specialUserFullname=null,specialClassName="",notSpecialClassName="",
}) => {

    const getUserClassName = (user_fullname=null)=>{
        if(specialUserFullname===null) return "";
        if(specialUserFullname === user_fullname) return specialClassName;
        return notSpecialClassName;
    }

    return ( 
    <div className={'home-user-conteiner'}>
        {more>0 && 
        <div className={userClassName+" "+getUserClassName()} >
            <User count={more} height={userHeight}/>
        </div>}
        {user_fullnames.map((fullname) => (
        <div key={fullname} className={userClassName +" "+getUserClassName(fullname)} >
                <User  user_fullname={fullname} height={userHeight} onClick={()=>onUserClick(fullname)}/>
        </div>
        ))}
    </div> );
}
 
export default UserContainer;