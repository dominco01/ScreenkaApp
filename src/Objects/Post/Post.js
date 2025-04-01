import React, { useContext } from 'react';
import "./_Post.css"
import App from '../App/App';
import { useState } from 'react';
import { useEffect } from 'react';
import { dateToHourString, dateToWeekDay } from '../../aFunctions';
import User from '../User/User';
import { AuthContext } from '../../Contexts/AuthContext';
import A from '../../Components/A';
import NothingToShow from '../../Pages/NothingToShow';
import { Format } from '../App/AppClass';
import { ButtonClose } from '../../Components/Buttons';

const Post = ({
        post=null,
        id,user_fullname,   
        onLoad,
        hideNickname=false,
        trySetView,
        content_only, content_toggled
    }) =>  {

    const {PostService,UserService,AppService} = useContext(AuthContext);

    const [postState,setPostState] = useState(post);
    useEffect(()=>{
        if(post) return;

        setPostState(null);

        const getPost = trySetView ? PostService.getPostAndTrySetMyView : PostService.getPost;
        getPost(user_fullname,id).then(post=>{ if(onLoad) onLoad(post); return post;}).then(setPostState);

    },[post,user_fullname,id])// eslint-disable-line react-hooks/exhaustive-deps

    const [userUsername,setUserUsername] = useState(null);
    useEffect(()=>{if(!hideNickname) UserService.getUserUsername(user_fullname).then(setUserUsername)},[hideNickname,user_fullname])
    
    const hideDisabled = content_only || content_toggled;
    const [isSuperHide,setIsSuperHide] = useState(false);
    useEffect(()=>{
        if(!postState) return;
        if(isSuperHide) return;
        if(hideDisabled) return;

        const timeout = setTimeout(()=>{
            if(PostService.hideIfAppsState?.includes(postState.app)) {setIsSuperHide(true);}
        },500)
        return ()=> clearTimeout(timeout)
    },[postState?.app]) //eslint-disable-line react-hooks/exhaustive-deps

    const [isHide,setIsHide] = useState(!hideDisabled);
    useEffect(()=>{  if(!hideDisabled) setIsHide(true); },[post,id,user_fullname]) //eslint-disable-line react-hooks/exhaustive-deps
    const [content,setContent] = useState("");
    useEffect(()=>{
        const getContent = async (post)=>{
            if(!post) return null;

            let app = AppService.getApp(post.app), content = post.content;
            switch(app?.format){
                case Format.LongString: return <h4 >{content}</h4>
                case Format.String: return <h3 >{content}</h3>
                case Format.Url: 
                    if(content?.startsWith("https://")) return <a href={content} target="_blank" rel="noreferrer">OPEN LINK</a>
                    return <h3 >{content}</h3> 
                case Format.Path: 
                    let src = await PostService.getPathPostContentUrl(user_fullname,content);
                    return <img alt="post content" src={src}></img>;
                default: return content;
            }
        }

        if(!isHide && !isSuperHide) getContent(postState).then(setContent);

    },[isHide,isSuperHide,postState]) // eslint-disable-line react-hooks/exhaustive-deps

    const getNotificationText = ()=>{
        if(postState?.top_number) return "#"+postState.top_number
        if(postState?.is_highlighted) return "*"
        return null
    }

    const getDate = ()=>{
        if(!postState) return "------- --:--";
        let date = postState.upload_date;
        return `${dateToWeekDay(date).toUpperCase()} ${dateToHourString(date)}`
    }

    const [contentToggled,setContentToggled] = useState(content_only || content_toggled);

    return ( 
    <div className='pre-pre-post'>

        {!hideNickname &&<div className="nickname">
            <User user_fullname={user_fullname}/>
            <h4 className='color-gray'>{userUsername?userUsername:"_______"}</h4>
        </div>}

        <div className='bcolor-dark-gray post'>

            {contentToggled && <div className='pre-fullcontent' >
                {!content_only &&<ButtonClose 
                    style={{position:"absolute",top:"10px",right:"10px"}}
                    onClick={()=>{setContentToggled(!contentToggled)}}
                />}
                <div className='fullcontent'>
                    <div className='scroll'>
                     {content!==null?content:<NothingToShow/>}
                    </div>

                    
                </div>
            </div>}

            {!content_only && <div style={!contentToggled?{}:{opacity:0,pointerEvents:'none'}}> 
            <h3 className='date'>
                {postState?.week_name?(postState.week_name.toUpperCase()+" | ") : ""}{getDate()}
            </h3>
            <div className='head'>
                <App application={AppService.getApp(postState?.app)} notificationText={getNotificationText()}/>
                {isSuperHide && <A bold onClick={()=>{if(isSuperHide)setIsSuperHide(false)}}>tap</A>}
            </div>
            <div className='pre-body' style={isSuperHide?{height:"0px"}:{}}>
                <div className='body' style={(isHide?{opacity:"0",pointerEvents:'none'}:{})}>
                    <div className='bcolor content flex-center noselect clickable' onClick={content_only?undefined:()=>{setContentToggled(!contentToggled)}}>
                        {content!==null?content:<NothingToShow/>}
                    </div>
                    <h4>{postState?.context}{(postState?.week_tag && postState.week_name)?` #${postState.week_name.replace(' ','')}`:""}</h4>
                </div>
                {isHide && <A bold className='centered'  onClick={()=>{if(isHide)setIsHide(false)}}>tap</A>}
            </div>
            </div>}
        </div>
    </div> );
}
 
export default Post;