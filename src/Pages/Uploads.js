import React, { useContext, useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthContext';
import { ButtonPrevPage } from '../Components/Buttons';
import {MiniPosts} from '../Objects/Post/MiniPosts';
import { delay } from '../aFunctions';
import { Event } from '../Objects/Event/_Event';
import { useLocation } from 'react-router-dom';

const HANDLING_EVENTS = {DayUploads:"dayuploads",WeekUploads:"weekuploads",ManageUploads:"manageuploads",}

const Uploads = () => {

    const navigate = useNavigate();

    const {user,PostService,screenkaDisabled,EventService} = useContext(AuthContext)
    const {type} = useParams();

    //token
    const location = useLocation();
    const token = location.state?.token;

    const [posts,setPosts]=useState(null);

    useEffect(()=>{
        const getUploads = (event)=>{
            switch(event.toString()){
                case HANDLING_EVENTS.ManageUploads: return PostService.getMyDayUploads().then(posts=>{let a= [...posts]; a.reverse(); return a; }); //desc order, from newest
                case HANDLING_EVENTS.DayUploads: return PostService.getMyDayUploads();
                case HANDLING_EVENTS.WeekUploads: return PostService.getMyWeekUploads();
                default: return Promise.reject();
            }
        }

        let event = EventService.getMyInteractiveEvent(type==="week"? HANDLING_EVENTS.WeekUploads : (type==="day"?HANDLING_EVENTS.DayUploads:(type==="manage"?HANDLING_EVENTS.ManageUploads:null)));

        if(!token && !Event.canInteract(event)) {navigate("/");return;}
        getUploads(event).then(posts=>{setPosts(posts); if(posts?.length>0 && !token) Event.setInteraction(event);}).catch(()=>navigate("/"))

    },[])// eslint-disable-line react-hooks/exhaustive-deps

    const handleOnPostCheckboxDelay = (e)=>{
        PostService.changeMyPostPermissions(e.target.id,{screenka:e.target.checked});
    }

    const handleOnPostDelete = (post_id)=>{
        if(posts.find(post=>post.id===post_id)  && window.confirm("Are you sure you want to delete this upload?"))
        {
            Promise.all([PostService.changeMyPostPermissions(post_id,{me:false,friends:false,screenka:false}),delay(100)])
                .then(()=>setPosts(posts.filter(post=>post.id!==post_id)))
        }
    }

    const handleOnPostPreview = (post_id)=>{
        navigate(`/post/${user.fullname}/${post_id}`,{state:{tokenizePage:location.pathname,showMyRefPosts:type!=="manage",showFriendsRefPosts:type==="week"}})
    }

    return (
        <div>
            {type==="manage" && <h2> <ButtonPrevPage/>Manage Uploads:</h2>}
            {type==="day" && <h2> <ButtonPrevPage/>Your Day Uploads:</h2>}
            {type==="week" && <h2> <ButtonPrevPage/> Your Week Uploads:</h2>}

            <MiniPosts posts={posts}
                checkboxesDisabled={!user.preferences.screenka || screenkaDisabled || type!=="manage"} maxChecks={type==="manage"?PostService.getMaxTickets():null} onPostCheckboxChangeDelay={handleOnPostCheckboxDelay}
                hourDate={type==="day" || type==="manage"} pretty_date={type==="manage"}
                preview={type==="day" || type==="week"} onPostPreview={handleOnPostPreview}
                delete_={type==="manage"}  onPostDelete={handleOnPostDelete}
                hideTickets={!user.preferences.screenka}
                crossed_eye_only={type==="manage"}
                no_crossed_eye_funny_info={type==="week"}
                no_eyes={type==="day"}
                
            />

       </div>);
}
 
export default Uploads;