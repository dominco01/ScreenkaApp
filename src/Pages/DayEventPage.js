import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NothingToShow from './NothingToShow';
import { AuthContext } from '../Contexts/AuthContext';
import {  randomElement } from '../aFunctions';
import { Event } from '../Objects/Event/_Event';

const HANDLING_EVENTS = {DayUploads:"dayuploads",WeekUploads:"weekuploads",WeekUploads2:"weekuploads2",OneShot:"oneshot",MorningShot:"morningshot",OhPreview:"ohpreview",ThrowBack:"throwback"}

const DayEventPage = () => { // dla day_eventow ktore maja page (isInteractive())

    const {event} = useParams();
    const navigate = useNavigate();

    const {user,HostService,PostService,WeekService,EventService} = useContext(AuthContext);

    const [isNothingToShow,setIsNothingToShow]=useState(false);

    useEffect(()=>{
        let day_event = EventService.getMyInteractiveEvent(event);
        if(!Event.canInteract(day_event)) {navigate("/"); return;}

        const timeout = setTimeout(async ()=>{
            let nav = await getNavigator(day_event);
            if(nav==null) setIsNothingToShow(true);
            else {
                nav.options = {replace:true, ...nav.options}
                navigate(nav.to,nav.options);
            }
        },1000)

        return ()=>clearTimeout(timeout)
    },[]) //eslint-disable-line react-hooks/exhaustive-deps

    //navigate
    const getNavigator=async (event)=>{
        const getOneShotNavigator=async ()=>{
            let [friends,]= HostService.getMyFriendsWithHostId();
            let friends_random = friends.sort(() => 0.5 - Math.random());
            var tos =[];
            for (const friend of friends_random) {
                let post = await PostService.getFriendCurrentDayRandomPost(friend);
                if (post)   tos.push(`/post/${friend}/${post.id}/${HANDLING_EVENTS.OneShot}`);
                if (tos.length >= 3) break;
            }
            if(tos.length===0) return null;
            return {to:tos[0],options:{state:{nextPages: tos.slice(1),showMyRefPosts:true}}}
        }
        const getMorningShotNavigator=async ()=>{
            let post = await PostService.getMyYesterdayRandomPost(); if(!post) return null;
            return {to:`/post/${user.fullname}/${post.id}/${HANDLING_EVENTS.MorningShot}`,options:{state:{showMyRefPosts:true,showFriendsRefPosts:true}}};//show na poprawe i zaskocznie, w koncu DayUploads ukrywaja friends interactions
        }
        const getOhPreviewNavigator=async()=>{
            let [friends,host_id]= HostService.getMyFriendsWithHostId();
            let random_friend = randomElement(friends);
            let week_name = await WeekService.getMyHostLastWeekName();
            return {to:`/posts/${random_friend}/${host_id}/${week_name}/${HANDLING_EVENTS.OhPreview}`}
        }
        const getThrowBackNavigator=async ()=>{
            let host_id  = HostService.getMyHostId()
            let week_name = await WeekService.getMyHostLastWeekName();
            return {to:`/posts/${user.fullname}/${host_id}/${week_name}/${HANDLING_EVENTS.ThrowBack}`}
        }

        switch(event.toString())
        { 
            case HANDLING_EVENTS.DayUploads: return {to:"/uploads/day"}
            case HANDLING_EVENTS.WeekUploads: return {to:"/uploads/week"}
            case HANDLING_EVENTS.WeekUploads2: return {to:"/uploads/week"}
            case HANDLING_EVENTS.OneShot: return getOneShotNavigator();
            case HANDLING_EVENTS.MorningShot: return getMorningShotNavigator();
            case HANDLING_EVENTS.OhPreview: return getOhPreviewNavigator();
            case HANDLING_EVENTS.ThrowBack: return getThrowBackNavigator();
            default: return null;
        }
    }

    if(isNothingToShow) return <NothingToShow goback/>
    return <div></div>
}
 
export default DayEventPage;