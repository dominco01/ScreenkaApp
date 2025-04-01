import React, {  useEffect, useMemo, useRef, useState } from "react";
import { GET_NOW, objectToPermissions } from "../aFunctions";
import Loading from "../Pages/Loading";
import { useHostService } from "../Services/HostService";
import { useUserService } from "../Services/UserService";
import { useWeekService } from "../Services/WeekService";
import { usePostService } from "../Services/PostService";
import { useEventService } from "../Services/EventService";
import { useAppService } from "../Services/AppService";

const NONE = false;

export const AuthContext = React.createContext();

const AuthProvider = ({children, demo}) => {

    //services
    const {getUser,getUserByFunnyname,getUserSrcUrl,trySetUsername,trySetPersonalizedApps,changeUserPreferences} = useUserService(demo);
    const {getHost,getCurrentWeekNumber} = useHostService(demo);
    const {getWeek,trySetHostWeekScreenkaView,onWeekSnapshot,getHostLastWeekName} = useWeekService(demo);
    const {getUserCurrentDayPosts,getUserCurrentWeekPosts,getPostTicketsUsed,changePostPermissions,postPost,getUserLatestPost,
    getUserCurrentDayRandomPost,getUserPastWeekPosts,getPost,getPostAndTrySetView,getPathPostContentUrl,getUserYesterdayRandomPost}=usePostService(demo);
    const {getAvailableDayEvents,getAvailableCustomEvents}=useEventService(demo);
    const {getApp,getBuildInApps}=useAppService(demo);

    //states
    const [user,setUser] = useState(NONE);
    const [host,setHost] = useState(NONE);
    const [week,setWeek] = useState(NONE);

    const user_fullname = user ? user.fullname : user;
    const host_id = host ? host.id : host;
    const host_subscribers = host ? host.subscribers : host;
    const week_name = week ? week.name : week;

    //loading
    const isUserLoading = user===NONE;
    const isHostLoading = host === NONE;
    const isWeekLoading = week===NONE;
    const isLoading =  useMemo(()=>{ return isUserLoading || isHostLoading || isWeekLoading},[isUserLoading,isHostLoading,isWeekLoading] )//useState(true);

    //refs , ala half classes, infos which can be known even if the main ref is null
    const userTemp = useRef(null); const getTempMe = ()=>userTemp.current; // used for temp login
    const hostIdRef = useRef(null); const getMyHostId = ()=> hostIdRef.current;
    const hostPopularAppsRef = useRef(null);
    const hostFriendsRef = useRef([]); const getMyFriends = ()=> hostFriendsRef.current;
    const getMyFriendsWithHostId=()=> [hostFriendsRef.current,hostIdRef.current]
    const setFriends = (user,host) =>{
        if(!user || !host) return;
        hostIdRef.current=host.id;
        hostPopularAppsRef.current = host.popular_apps;
        hostFriendsRef.current = host.getFriends(user.fullname)
    }

    //refs plus
    const ticketsRef = useRef(0);  const getTickets = ()=> ticketsRef.current;
    const maxTicketsRef = useRef(0); const getMaxTickets = ()=>maxTicketsRef.current;
    const dayUploads = useRef(null);
    const weekUploads=useRef(null);

    useEffect(()=>{
        const _getUser= async ()=>{
            let funnyname = localStorage.getItem("funnyname");
            let user = await getUserByFunnyname(funnyname);
            if(!user || !user.preferences.me) return null;
            return user;
        }

        if(user === NONE)  _getUser().then(setUser)
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        const _getHost = async(user)=>{ 
            if(!user) return null;
            let defaultHost = await getHost(user?.hosts?.at(0) );
            /*2*/if(!defaultHost || !defaultHost.subscribers.has(user.fullname)) return null;
            /*1*/if(user.preferences.friends){
                /*2*/let leave_date = defaultHost.subscribers.get(user.fullname).leave_date;
                /* */if(leave_date==null || leave_date>GET_NOW()) setFriends(user,defaultHost);
            }
            return defaultHost;
        }
        if(user !== NONE && host===NONE) _getHost(user).then(setHost)
    },[user_fullname]) // eslint-disable-line react-hooks/exhaustive-deps

    
    useEffect(()=>{
        const _getWeek = async(user,host)=>{
            const loadTickets = async (user,host,week)=>{
            let ticketsUsed = await getPostTicketsUsed(user.fullname,host.id);
            maxTicketsRef.current = week?.max_tickets?week.max_tickets: (host?.max_tickets?host.max_tickets:0);
            ticketsRef.current = Math.max(maxTicketsRef.current-ticketsUsed,0);
            return week;
            }
            if(!user || !host) return null;
            //if(!user.preferences.me) return null; // i tak jest condition na dole
            /*2*/ let join_date = host.subscribers.get(user.fullname).join_date;
            /* */if(join_date==null || join_date>GET_NOW()) return null;
            let week = getWeek(host.id,null,true);
            if(user.preferences.screenka) await loadTickets(user,host,week);
            return week;
        }
        if(user!==NONE && host!== NONE && week === NONE) _getWeek(user,host).then(setWeek);
    },[host_id]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        if(!host || !week ) return;
        const unsubscribe = onWeekSnapshot(host.id,week.name,setWeek);
        return () => unsubscribe()
    },[host_id, week_name]) // eslint-disable-line react-hooks/exhaustive-deps

    //nie ukrywa jesli masz trial version lub jestes subskrybujacy miedzy data - logiczne
    const friendsDisabled = useMemo(()=>{
        if(!host || !user || !host?.subscribers || !user?.fullname || !host?.subscribers?.has(user.fullname)) return true;// || !user.preferences.friends
        let sub = host.subscribers.get(user.fullname);
        return !(sub.leave_date == null || sub.leave_date>GET_NOW());
    },[user_fullname,host_subscribers])

    //nie ukrywa jesli jestes subskrybujacy miedzy data - logiczne
    const screenkaDisabled = useMemo(()=>{
        if(!host || !user || !host.subscribers || !user.fullname || !host.subscribers.has(user.fullname)) return true; // || !user.preferences.screenka
        let sub = host.subscribers.get(user.fullname);
        return !(sub.join_date!=null && sub.join_date<GET_NOW() && !(sub.leave_date!=null && sub.leave_date < GET_NOW()));
    },[user_fullname, host_subscribers])


    //USER CONTEXT

    const tryLogMeInTemporarly = async (funnyname)=>{
        return getUserByFunnyname(funnyname)
            .then(user=>{
                if(user==null) return false;
                userTemp.current = user;
                return true; })
    }
    const trySetMyUsername= async (username)=> trySetUsername(userTemp.current.fullname,username).then((res)=>{userTemp.current.username = username;return res})  //if(res) user..username => username;
    const trySetMyPersonalizedApps = async (apps)=> trySetPersonalizedApps(userTemp.current.fullname,apps).then((res)=>{userTemp.current.personalized_apps = apps; return res;})
    const saveMe =()=>{
        if(!userTemp.current) throw new Error('Cannot save. User is null');

        localStorage.setItem("funnyname",userTemp.current.funnyname);
        changeUserPreferences(userTemp.current.fullname,{me:true,friends:true,screenka:true})
        userTemp.current.preferences = {me:true,friends:true,screenka:true};
        
        setWeek(NONE); 
        setHost(NONE); 
        setUser(userTemp.current);
    }
   
    const changeMyPreferences=async(preferences)=> {
        if(friendsDisabled) preferences.friends = true; //!
        if(screenkaDisabled) preferences.screenka = true; //!
        return changeUserPreferences(user.fullname,preferences).then(()=>{
            let temp = {...user}; 
            temp.preferences = preferences;
            if(!temp.preferences.me) setUser(null);
            else setUser(temp);
        })
    }

    const getUserUsername = (user_fullname) =>getUser(user_fullname).then(user => user?.username);


    //friend (uses hostid rather than host)
    const getFriendFunction =async (func,user_fullname,...args) =>{
        const checkFriend=(user_fullname)=> hostFriendsRef.current.includes(user_fullname)
        if(!checkFriend(user_fullname) && user_fullname !== user.fullname) return null;
        return func(user_fullname,...args)
    }

    const getFriend = async (user_fullname)=> getFriendFunction(getUser,user_fullname);
    const getFriendSrcUrl = async (user_fullname)=> getFriendFunction(getUserSrcUrl,user_fullname)
    const getFriendLatestPost = async (user_fullname)=>getFriendFunction(getUserLatestPost,user_fullname,hostIdRef.current,true,[...user.personalized_apps,...hostPopularAppsRef.current]);
    const getFriendCurrentDayRandomPost=async (user_fullname)=>getFriendFunction(getUserCurrentDayRandomPost,user_fullname,hostIdRef.current,true,[...user.personalized_apps,...hostPopularAppsRef.current]);
    const getFriendPastWeekPosts = async (user_fullname,week_name)=> getFriendFunction(getUserPastWeekPosts,user_fullname,week_name,hostIdRef.current,true,[...user.personalized_apps,...hostPopularAppsRef.current],true)
    
    //user
    const getUserCurrentDayPostsHOST = async (user_fullname,host_id=null)=>{ //host only, wiec bez okApps
    let host = (host_id===null && AM_I_HOST())? null : hostIdRef.current;
    return getUserCurrentDayPosts(user_fullname,host);
    }
    const getUserCurrentWeekPostsHOST = async (user_fullname,host_id=null)=>{//host only, wiec bez okApps
        let host = (host_id===null && AM_I_HOST())? null : hostIdRef.current;
        return getUserCurrentWeekPosts(user_fullname,host);
    }

    //Host CONTEXT

    const weekNumber = useMemo(() => getCurrentWeekNumber(host?.start_date), [host?.start_date]);
    
    const getMyGroups = ()=> host?.getMyGroups(user?.fullname);  // returns undefined, null or array

    const getHostPersonalizedApps = (host_id)=>getHost(host_id).then(host=> host ? host.personalized_apps: []);

    //WEEK CONTEXT
    const getWeekAppsCounts = (host_id,week_name)=> getWeek(host_id,week_name).then(week=> week ? week.apps_counts : new Map()) //returns Map

    const trySetMyScreenkaView = async(host_id,week_name)=>{//host_id, week_name - ala klucze do wysetowania
        if(!host_id || !week_name) return false;
        return trySetHostWeekScreenkaView(host_id,week_name, user.fullname);
    }

    const getMyHostLastWeekName = async ()=>{
        return getHostLastWeekName(hostIdRef.current);
    }

    //POST CONTEXT

    const getMyDayUploads = async ()=>{
        const loadMyDayUploads=async (me_fullname,host_id)=>{
            const getTicketsUsed=(posts)=>posts.filter(post=>post.permissions.screenka).length;
            return getUserCurrentDayPosts(me_fullname,host_id).then(posts=>{
                    dayUploads.current=posts;
                    ticketsRef.current =Math.max(getMaxTickets()-getTicketsUsed(posts),0);
            }); 
        }

        if(dayUploads.current==null) await loadMyDayUploads(user.fullname,host?.id);
        return dayUploads.current.filter(post => post.permissions.me === true);
    }
    const getMyWeekUploads = async ()=>{
        const loadMyWeekUploads=async (me_fullname,host_id)=>{
            return getUserCurrentWeekPosts(me_fullname,host_id).then(posts=>{
                    weekUploads.current=posts;
            }); 
        }

        if(weekUploads.current==null) await loadMyWeekUploads(user.fullname,host.id);
        return weekUploads.current.filter(post => post.permissions.me === true);
    }
    const getMyPastWeekPosts = async (week_name)=>{
        let host_id = getMyHostId()
        return getUserPastWeekPosts(user.fullname,week_name,host_id)
    }

    const getMyYesterdayRandomPost = async ()=>{
        return getUserYesterdayRandomPost(user.fullname,host.id);
    }
     const getMyAppsCounts= async()=>{
        if(!user) return null;
        let posts = await getMyDayUploads();
        let counts = {};
        posts?.forEach(function (post) {counts[post.app] = (counts[post.app] || 0) + 1; });
        return new Map(Object.entries(counts));
    }

    const changeMyPostPermissions=async(post_id,permissions)=>{
        return changePostPermissions(user.fullname,post_id,permissions).then(()=>{
            if(dayUploads.current!=null) dayUploads.current=dayUploads.current.map(post=>{if(post.id===post_id) post.permissions = objectToPermissions(permissions,post.permissions); return post;})
            if(weekUploads.current!=null) weekUploads.current=weekUploads.current.map(post=>{if(post.id===post_id) post.permissions = objectToPermissions(permissions,post.permissions); return post;})   
        })
    }

    const [myRecentlyAddedPosts,setMyRecentlyAddedPosts] = useState([]);
    const resetMyRecentlyAddedPosts = ()=> setMyRecentlyAddedPosts([]);

    const postMyPost = async (post, file)=>{
        if(host) post.host_id = host.id;
        if(week) post.week_name = week.name;
        post.upload_date = GET_NOW();
        post.permissions = {
            me: post.permissions.me && user.preferences.me,
            friends: post.permissions.friends && ( !friendsDisabled && user.preferences.friends),
            screenka: post.permissions.screenka && ( !screenkaDisabled && user.preferences.screenka && ticketsRef.current>0)
        }
        post.week_tag = post.week_tag && post.week_name;

        return postPost(user.fullname,post,file)
            .then((post_id)=>{
                ticketsRef.current = Math.max(ticketsRef.current-1,0);
                post.id = post_id;
                if(dayUploads.current!=null) dayUploads.current.push(post);
                if(weekUploads.current!=null) weekUploads.current.push(post);
                setMyRecentlyAddedPosts([...myRecentlyAddedPosts,post]);
            })
    }

    const [hideIfAppsState,setHideIfAppsState2]=useState();
    const setHideIfAppsState=(user,host_personalized_apps=[])=>{
        let diff = host_personalized_apps.filter(app => !user.personalized_apps.includes(app));
        setHideIfAppsState2(diff);
    }

    const getPostAndTrySetMyView =async (user_fullname,id)=>{ //znasz id to masz, fajne do sharowania
        return getPostAndTrySetView(user_fullname,id,user.fullname);
    }


    /*HOST */
    const AM_I_HOST = ()=>{
        if(!user) return false;
        return host?.fullname === user.fullname;
    }
    const GET_HOST_ID = ()=>{
        if(AM_I_HOST()) return host.id;
        return null;
    }

    /*EVENTS (myDayEvents i disabledEvents sie wykluczaja)*/
    
    const myDayEvents=useMemo(()=>{
        if(!user) return [];
        let permissions = {
            me: user.preferences.me, 
            friends: user.preferences.friends && !friendsDisabled,
            screenka: user.preferences.screenka && !screenkaDisabled
        }
        return getAvailableDayEvents(weekNumber,permissions);
    },[weekNumber, user?.preferences,friendsDisabled,screenkaDisabled])

    const disabledDayEvents=useMemo(()=>{
        return getAvailableDayEvents(weekNumber,{friends: friendsDisabled, screenka:screenkaDisabled})
            .filter(event=> !myDayEvents.map(event=>event.name).includes(event.name) )
    },[weekNumber, friendsDisabled,screenkaDisabled])

    const myCustomEvents=useMemo(()=>{
        if(!user) return [];
        let permissions = {
            me: user.preferences.me, 
            friends: user.preferences.friends && !friendsDisabled,
            screenka: user.preferences.screenka && !screenkaDisabled
        }
        return getAvailableCustomEvents(weekNumber,permissions);
    },[weekNumber, user?.preferences,friendsDisabled,screenkaDisabled])

    const getMyInteractiveEvent = (string)=> [...myDayEvents,...myCustomEvents].find(event=>event.toString()===string && event.isInteractive())
    
    const value = {
        user,
        host: (user?.preferences?.me) ? host : null,
        week:  (user?.preferences?.me) ? week: null,

        friendsDisabled,screenkaDisabled,

        AM_I_HOST,GET_HOST_ID,

        UserService:{
            getTempMe,//me auth
            trySetMyUsername,trySetMyPersonalizedApps,changeMyPreferences,tryLogMeInTemporarly,saveMe, //me auth (setters)
            getFriend,getFriendSrcUrl, //friends auth
            getUserUsername,getUserSrcUrl,//no auth
        },
        HostService:{
            weekNumber,getMyHostId,getMyFriends,getMyFriendsWithHostId,getMyGroups,//me auth
            getHostPersonalizedApps,//no auth
        },
        WeekService:{
            getMyHostLastWeekName, //me auth
            trySetMyScreenkaView,//me auth (setters)
            getWeekAppsCounts,//no auth
        },
        PostService:{
            getMyPastWeekPosts, getMyDayUploads,getMyWeekUploads,getMyYesterdayRandomPost,//me auth
            hideIfAppsState,getTickets,getMaxTickets, getMyAppsCounts,getPostAndTrySetMyView,myRecentlyAddedPosts,//me auth 2
            setHideIfAppsState,postMyPost,changeMyPostPermissions,resetMyRecentlyAddedPosts, //me auth (setters)
            getFriendLatestPost, getFriendCurrentDayRandomPost,getFriendPastWeekPosts,//friends auth
            getUserCurrentDayPostsHOST,getUserCurrentWeekPostsHOST, //HOST auth
            getPost,getPathPostContentUrl,//no auth
        },
        AppService:{
            getApp, getBuildInApps,//no auth
        },
        EventService:{
            myDayEvents,disabledDayEvents,myCustomEvents,getMyInteractiveEvent,//me auth
        },
    }
    return ( 
    <AuthContext.Provider value={value}>
        {isLoading ? <Loading logo/> : children}
    </AuthContext.Provider> );
}

export default AuthProvider;