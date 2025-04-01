import React, { useContext, useEffect, useMemo } from 'react';
import {  useLocation, useNavigate, useParams } from 'react-router-dom';
import Post from '../Objects/Post/Post';
import { ButtonNextPage, ButtonPrevPage } from '../Components/Buttons';
import { Event } from '../Objects/Event/_Event';
import { AuthContext } from '../Contexts/AuthContext';

const HANDLING_EVENTS = {RnShot:"rnshot",OneShot:'oneshot',MorningShot:"morningshot",UploadNow:"uploadnow"}

const PostPage = () => { //state: nextPage, showMyRefPosts, showFriendsRefPosts

    const location = useLocation();
    const nextPages = location.state?.nextPages;
    const tokenizePage = location.state?.tokenizePage;
    const token = location.state?.token; 
    //const showMyRefPosts = location.state? location.state.showMyRefPosts===true : false;
    //const showFriendsRefPosts =location.state? location.state.showFriendsRefPosts===true : false;

    const navigate = useNavigate();
    const {user_fullname,id,event} = useParams();
    const {EventService,PostService} = useContext(AuthContext);
    const event_ = useMemo(()=>EventService.getMyInteractiveEvent(event),[event])

    useEffect(()=>{
        if(!user_fullname || !id) {navigate('/'); return;}
    },[user_fullname, id])

    const title = useMemo(()=>event_ ? event_.name.toUpperCase():"User Post:",[event_])

    const handleOnNextClick = ()=>{
        navigate(nextPages[0],{replace:true,state:{token:true,nextPages:nextPages.slice(1)}}); //showMyRefPosts:showMyRefPosts, showFriendsRefPosts:showFriendsRefPosts
    }

    const onPostLoad = (post)=>{
        if(!event) return;

        let props={}; if(event_?.toString()===HANDLING_EVENTS.RnShot) props.date=post.upload_date;
        
        if(!token && !Event.canInteract(event_,props)){navigate('/'); return;}

        if(!token)
        {
            switch(event_?.toString())
            {
                case HANDLING_EVENTS.RnShot:
                case HANDLING_EVENTS.MorningShot:
                case HANDLING_EVENTS.OneShot:
                    Event.setInteraction(event_);
                    break;
                case HANDLING_EVENTS.UploadNow:
                    Event.setInteraction(event_);
                    PostService.resetMyRecentlyAddedPosts();
                    break;
                default:
                    navigate('/');
                    return;
            }
        }
    }

    return ( <div>

        <h2>
            <ButtonPrevPage alert={nextPages?.length>0} onClick={tokenizePage ? ()=> navigate(tokenizePage,{replace:true,state:{token:true,}}):undefined}/>
            {title}
            {nextPages?.length>0 && <ButtonNextPage focus onClick={handleOnNextClick}/>}
        </h2>

        <Post id={id} user_fullname={user_fullname} trySetView={event_!==null && event_?.toString()!==HANDLING_EVENTS.UploadNow} onLoad={onPostLoad} />
    </div> );
}
 
export default PostPage;