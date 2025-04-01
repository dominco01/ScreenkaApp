import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthContext';
import { ButtonPrevPage, ButtonNextPage } from '../Components/Buttons';
import {MiniPosts} from "../Objects/Post/MiniPosts"
import { DAY_EVENT_POSTS } from '../aFunctions';
import { useRef } from 'react';
import { useMemo } from 'react';
import { Event } from '../Objects/Event/_Event';

const HANDLING_EVENTS = {ThrowBack:"throwback",OhPreview:"ohpreview"}

const MiniPostsPagePlus = () => {

    const {user_fullname,host_id,week_name,event} = useParams(); // event_string
    const navigate = useNavigate();
    const {EventService,PostService} = useContext(AuthContext);

    //token
    const location = useLocation();
    const token = location.state?.token;

    const event_ = useMemo(()=>EventService.getMyInteractiveEvent(event),[event])
    const [posts,setPosts] = useState(null);

    const postCheckboxMap = useRef(new Map());
    const [checks,setChecks] = useState(0);
    const handleOnPostCheckboxChange = (e)=>{
        if(postCheckboxMap.current.has(e.target.name)) postCheckboxMap.current.delete(e.target.name);
        else postCheckboxMap.current.set(e.target.name,e.target.checked);

        setChecks(postCheckboxMap.current.size);
    }


    useEffect(()=>{
        if(!user_fullname || !host_id || !week_name) {navigate("/"); return;}
       
        if(!token && !Event.canInteract(event_)) {navigate("/"); return;}

        switch(event_.toString()){
            case HANDLING_EVENTS.ThrowBack:
                PostService.getMyPastWeekPosts(week_name).then(posts=>posts==null?navigate("/"):setPosts(posts));
                break;
            case HANDLING_EVENTS.OhPreview:
                PostService.getFriendPastWeekPosts(user_fullname,week_name).then(posts=>posts==null?navigate("/"):setPosts(posts));
                break;
            default:
                navigate('/');
                return;
        }
    },[]) //eslint-disable-line react-hooks/exhaustive-deps

    const isPosts = posts !== null;
    useEffect(()=>{
        if(isPosts && posts.length>0 && !token) Event.setInteraction(event_);
    },[isPosts]) //eslint-disable-line react-hooks/exhaustive-deps

    const handleOnNextPageClick = ()=>{
        let tos = Array.from(postCheckboxMap.current.keys()).map(post_id=> `/post/${user_fullname}/${post_id}/${event_}`);
        
        return navigate(tos[0],{replace:true,state:{token:true,nextPages: tos.slice(1),showMyRefPosts:true,showFriendsRefPosts:true}})
    }

    return (
        <div>
            <h2> <ButtonPrevPage/>{event_.name?.toUpperCase()}<ButtonNextPage focus disabled={checks===0} onClick={handleOnNextPageClick} /></h2>
            
            <MiniPosts posts={posts} title = {`${week_name}`} no_eyes
            maxChecks={DAY_EVENT_POSTS} 
            customCheckboxes={true}
            onPostCheckboxChange={handleOnPostCheckboxChange}
            />
       </div>);
}
 
export default MiniPostsPagePlus;