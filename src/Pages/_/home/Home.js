import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import './Home.css';
import { AuthContext } from '../../../Contexts/AuthContext';
import { BottomTabContext } from '../../../Contexts/BottomTabContext';
import { useNavigate } from 'react-router-dom';
import { MAX_ST_VIEWS, datesWeekDelta, delay } from '../../../aFunctions';
import { ButtonScreenka,ButtonPlus, ButtonText, ButtonNow } from './components/Buttons';
import { AppClass, AppType } from '../../../Objects/App/AppClass';
import A from '../../../Components/A';
import { ButtonNextPage } from '../../../Components/Buttons';
import { Event } from '../../../Objects/Event/_Event'
import { UserClass } from '../../../Objects/User/UserClass';
import AppContainer from '../../../Components/AppContainer';
import UserContainer from '../../../Components/UserContainer';


const HANDLING_EVENTS = {RnShot:"rnshot",UploadNow:"uploadnow",ScreenkaTygodnia:"screenkatygodnia",Upload:"upload",ManageUploads:"manageuploads"}

const height = 70;
const userHeight=32;
const borderRadius = 15;
const buttonStyle = {height:height+"px",borderRadius:borderRadius+"px"}

const HOME_APPS_SIZE = 6;

const Home = ({onAboutWeekClick}) => {

    const {user,host,week,HostService,PostService,EventService,AppService} = useContext(AuthContext)
    const {setBottomTab,isBottomTab,getObject,} = useContext(BottomTabContext);
    const navigate = useNavigate();

    const isHost = host!= null;
    const uploadApps = useMemo(()=>{
        if(!isHost) return AppService.getBuildInApps();
        var apps = [...host.popular_apps,...user.personalized_apps,...user.super_personalized_apps];
        if(week && week?.extra_apps!=null) apps = apps.concat(week.extra_apps);
        if(week && week?.blocked_apps!=null) apps = apps.filter( (app) => !week.blocked_apps.includes(app) );
        apps = apps.map(app=>AppService.getApp(app));
        apps.sort((a,b)=>a.label-b.label);
        return apps;
    },[isHost])
    const [homeApps,setHomeApps] = useState(uploadApps);//max_len = HOME_APPS_SIZE
    
    const [participantsCount,setParticipantsCount] = useState(0);
    const [friendsParticipants,setFriendsParticipants] = useState([]) //user_fullnames, + ja
    const [appsCountsMap,setAppsCountsMap] = useState(new Map()) //Map: (appname,count )

    const [isUploadMode,setIsUploadMode] = useState(false);

    //buttons    
    const currDayEvent = useMemo(()=> EventService.myDayEvents
        .filter((event)=> event.isInteractive() && event.isTime())?.at(0)
    ,[EventService.myDayEvents]) 

    const isCurrDayEventDisabled = useMemo(()=>!Event.canInteract(currDayEvent),[currDayEvent])

    const [myRnShotEventData,setMyRnShotEventData] = useState(null);//{user_fullname,post_id}
    const myUploadNowEventData = PostService.myRecentlyAddedPosts.length > 0 ? [...PostService.myRecentlyAddedPosts] : null; //{[post]}

    const [isScreenka,setIsScreenka] = useState(false);

    //event
    const myRnShotEvent = useMemo(()=>EventService.getMyInteractiveEvent(HANDLING_EVENTS.RnShot),[EventService.getMyInteractiveEvent])
    const myUploadNowEvent = useMemo(()=>EventService.getMyInteractiveEvent(HANDLING_EVENTS.UploadNow),[EventService.getMyInteractiveEvent])
    const myScreenkaEvent = useMemo(()=>EventService.getMyInteractiveEvent(HANDLING_EVENTS.ScreenkaTygodnia),[EventService.getMyInteractiveEvent])
    const myUploadEvent = useMemo(()=>EventService.getMyInteractiveEvent(HANDLING_EVENTS.Upload),[EventService.getMyInteractiveEvent])
    const myManageUploadsEvent = useMemo(()=>EventService.getMyInteractiveEvent(HANDLING_EVENTS.ManageUploads),[EventService.getMyInteractiveEvent])

    useEffect(()=>{
        const loadParticipants = async (user,friends,week_participants)=>{
            if(!week_participants) return;
        
            let friends_participants_fullnames = week_participants.filter(parti=>friends.includes(parti));
            if(week_participants.includes(user.fullname)) friends_participants_fullnames.push(user.fullname);//!
            setFriendsParticipants( friends_participants_fullnames)
            setParticipantsCount(week_participants.length)
        }

        loadParticipants(user,HostService.getMyFriends(),week?.today_participants)
    },[week?.today_participants]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        const loadRnShot = async (me_fullname,latest_post)=>{
            if(latest_post==null)return;
            let uploader = latest_post?.user;
            if(uploader==null) return;
            if(uploader===me_fullname) return;
            
            if(!Event.canInteract(myRnShotEvent,{date:latest_post?.date})) return;
            if(!HostService.getMyFriends().includes(uploader)) return;
            PostService.getFriendLatestPost(uploader).then((post)=>{
                if(post) setMyRnShotEventData({user_fullname:uploader,post_id:post.id,app: post.app})})
            }

        if(myRnShotEvent) loadRnShot(user.fullname,week?.latest_post);
    },[week?.latest_post,myRnShotEvent])// eslint-disable-line react-hooks/exhaustive-deps

    const nowAppNames = useMemo(()=>{
        if(myUploadNowEventData) return myUploadNowEventData.map(post=>post.app);
        else if (myRnShotEventData) return [myRnShotEventData.app];
        return [];
    },[myRnShotEventData,myUploadNowEventData]) 
    
    useEffect(()=>{
        const sortHomeApps = (appsMap=new Map())=>{
            const isFirstInGroup=(arr,app)=>{
                let first = arr.find(a=>a.getGroup()===app.getGroup());
                return first === app;
            }
    
            let apps = uploadApps;
    
            if(apps && appsMap ) {//&& appsMap.length>0
                //sort by notification count
                apps = [...apps].sort((a,b)=>(  (appsMap.get(b.name) ||0 - appsMap.get(a.name) ||0) *100+  (a.label-b.label)));
    
                //get firsts in group
                let copy = [...apps];
                copy = copy.filter(app=>isFirstInGroup(apps,app));
                copy = copy.slice(0,HOME_APPS_SIZE);
                
                //add extra apps
                let extra = HOME_APPS_SIZE - copy.length;
                apps.every(app => {
                    if(extra===0) return false;
                    if(!copy.includes(app)) {copy.push(app);extra--;}
                    return true;
                });
    
                //final sort
                copy.sort((a,b)=>a.label-b.label);
    
                setHomeApps(copy)
            }   
        }
        sortHomeApps(appsCountsMap)
    },[appsCountsMap])// eslint-disable-line react-hooks/exhaustive-deps
    

    //CASE 1
    useEffect(()=>{
        if(week) setAppsCountsMap(week.today_apps_counts);
    },[week?.today_apps_counts]) // eslint-disable-line react-hooks/exhaustive-deps

    //CASE 2
    const tryGetMyAppsCounts = async (force=false)=>{
        if(!week && user && ((!isBottomTab() && isUploadMode )|| force) ) {
            let map = await PostService.getMyAppsCounts();
            setAppsCountsMap(map);
            if(map.size!==0) {setParticipantsCount(1);setFriendsParticipants([user.fullname])}
    } }
    useEffect(()=>{tryGetMyAppsCounts(true)},[]) // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(()=>{tryGetMyAppsCounts(); },[isBottomTab()]) // eslint-disable-line react-hooks/exhaustive-deps

    const isButtonScreenkaDisabled = useMemo(()=>{
        if(!myScreenkaEvent) return true;
        return !Event.canInteract(myScreenkaEvent,{week:week});
    },[host?.id, myScreenkaEvent]);

    useEffect(()=>{
        const loadScreenka = async (week)=>
        {
                if(myScreenkaEvent.isTime({week:week})) 
                {
                    if(!isButtonScreenkaDisabled) await delay(2000);
                    setIsScreenka(true)
                }
            }

        if(week && myScreenkaEvent) loadScreenka(week);
    },[week,myScreenkaEvent]) // eslint-disable-line react-hooks/exhaustive-deps

    const apps = useMemo(()=>{
        return isUploadMode? uploadApps : homeApps.slice(0,HOME_APPS_SIZE);
    },[isUploadMode,homeApps])

    const handleAppClick=(app)=>{
        const getAppType = (app,host)=>{
            if(!host) return AppType.Popular;
            if(host.personalized_apps.includes(app.name)) return AppType.Personalized;
            if(host.popular_apps.includes(app.name)) return AppType.Popular;
            if(host.group_apps.includes(app.name)) return AppType.Group;
            //superPopular support soon
            return AppType.SuperPersonalized;
        }

        if(!isUploadMode) setBottomTab({id:0,object:app,total_uploads: appsCountsMap.get(app.name)?appsCountsMap.get(app.name):0})
        else setBottomTab({id:1,object:app,app_type:getAppType(app,host)})
    }

    const handleUserClick=(user_fullname)=>{
        if(host==null)  setBottomTab({id:2,object:user_fullname,since_week:0});
        else
        {
            let since_week = datesWeekDelta(host.start_date,host.subscribers.get(user_fullname)?.join_date);
            setBottomTab({id:2,object:user_fullname,since_week:since_week, role: host.subscribers.get(user_fullname)?.role});
        }
    }

    const defaultClassName=useMemo(()=>{
        return "home-blur-dark-pre "+(isBottomTab()?"home-blur-dark":"")
    },[isBottomTab])
   
    /* BUTTONS START */

    const handleDayEventClick = (event)=> {if(event) navigate(`/dayevent/${event.toString()}`)}
    const handleRnShotClick=()=>{   navigate(`/post/${myRnShotEventData.user_fullname}/${myRnShotEventData.post_id}/${myRnShotEvent}`,{state:{showMyRefPosts:true,showFriendsRefPosts:false}});  }
    const handleUploadNowClick=()=>{
        if(!user && myUploadNowEvent) return;
        let pages = myUploadNowEventData.map(post=> `/post/${user.fullname}/${post.id}/${myUploadNowEvent}`);
        navigate(pages[0],{state:{nextPages:pages.slice(1),showMyRefPosts:true,showFriendsRefPosts:false}})
    }

    const handleButtonScreenkaClick = ()=>{
        if(host==null) return;

        let count_str = localStorage.getItem("screenka_count_"+host.id);

        let message = "Are you sure you want to see this content?";
        if(count_str && Number(count_str)===MAX_ST_VIEWS-1) message = "You will see this content for the last time. Continue?";
        if(MAX_ST_VIEWS===1) message="You can see this content only once. Continue?"

        if(window.confirm(message)) navigate("/screenka/"+host.id)
    }

    const special_  = useMemo(()=>{
        if(getObject()?.constructor === AppClass) return getObject().name
        if(getObject()?.constructor === UserClass) return getObject().fullname
        if(getObject()) return "other";
        return null;
    },[getObject()])

    return (
    <div className={"home "+( isBottomTab()?'noclick':"")}>
        <div className={defaultClassName} >
            <h1 className='home-title'>
                <span>WEEK</span> 
                <ButtonNextPage disabled={(week==null || HostService.weekNumber==null)} onClick={onAboutWeekClick}>
                #{HostService.weekNumber?HostService.weekNumber:0}
                </ButtonNextPage>
            </h1>
        </div>

        {myUploadNowEventData && <div className={defaultClassName+" home-button-effect"}  style={(!isBottomTab() && !isUploadMode)?{height:height+"px"}:{height:"0px",marginBottom:"0px",overflow:"hidden"}}>
            <ButtonNow onClick={handleUploadNowClick} style={buttonStyle} text="UPLOAD NOW"/>
        </div>}

        
        {currDayEvent && //(!isCurrDayEventDisabled || !myScreenkaEvent.isTime({week:week})) &&
        <div className={defaultClassName+" home-button-effect"}  style={(!isBottomTab() && !isUploadMode)?{height:height+"px"}:{height:"0px",marginBottom:"0px",overflow:"hidden"}}>
            <ButtonText disabled={isCurrDayEventDisabled} onClick={()=>handleDayEventClick(currDayEvent)} style={buttonStyle} text={currDayEvent.name.toUpperCase()}/>
        </div>}        

        {isScreenka&& (!currDayEvent || isCurrDayEventDisabled) &&
        <div className={defaultClassName+" home-button-effect"} style={(!isBottomTab() && !isUploadMode)?{height:height+"px"}:{height:"0px",marginBottom:"0px",overflow:"hidden"}} >
            <ButtonScreenka disabled={isButtonScreenkaDisabled} onClick={handleButtonScreenkaClick} style={buttonStyle}/>
        </div>}

        {myRnShotEventData &&
        <div className={defaultClassName+" home-button-effect"}  style={(!isBottomTab() && !isUploadMode)?{height:height+"px"}:{height:"0px",marginBottom:"0px",overflow:"hidden"}}>
            <ButtonNow onClick={handleRnShotClick} style={buttonStyle} text="RIGHT NOW!"/>
        </div>}

        <div className={defaultClassName} >
            <ButtonPlus disabled={!myUploadEvent || !myUploadEvent.isTime()} style={buttonStyle} onClick={()=>setIsUploadMode(!isUploadMode)} isRotate={isUploadMode}/>
        </div>
        
        <AppContainer
            apps={apps} notificationCountsMap={appsCountsMap} disabled={!user.preferences.me} 
            appHeight={height} onAppClick={handleAppClick} appClassName='home-blur-dark-pre' 
            specialAppName={special_} notSpecialClassName='home-blur-dark'
            orangeAppNames={nowAppNames} isUploadMode={isUploadMode} 
        />
    
        {user.preferences.me && !isUploadMode && <UserContainer
            user_fullnames={friendsParticipants} more={participantsCount-friendsParticipants.length}
            userHeight={userHeight} onUserClick={handleUserClick} userClassName='home-blur-dark-pre'
            specialUserFullname={special_} notSpecialClassName='home-blur-dark'
        />}
       
        {!isUploadMode && isBottomTab()  &&<div style={{height:"290px"}}></div>}     
        {!isUploadMode && !isBottomTab() && <footer className={'center '+(!user.preferences.me ?" text-shine":"")}><A nocolor onClick={()=>setBottomTab({id:4})}>SCREENKA Ⓡ</A></footer>}
        {isUploadMode && myManageUploadsEvent && <footer className='center'><A underline onClick={()=>navigate("/uploads/manage")} >manage uploads</A></footer>}
        
    </div>

)}

export default Home;