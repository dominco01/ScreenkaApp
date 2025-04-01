import React, { useContext, useEffect, useState } from 'react';
import {App} from '../../../Objects/App/App';
import Checkbox from '../../../Components/Checkbox';
import "./Setup.css"
import {AuthContext} from "../../../Contexts/AuthContext"
import { ButtonNext } from '../../../Components/Buttons';
import { useRef } from 'react';
import InputField from '../../../Components/InputField';
import { getPath } from '../../../aFunctions';
import Loading from '../../Loading';

const Setup = ({onSetup}) => {

    const {UserService,HostService,AppService} = useContext(AuthContext);

    const [meSrcUrl,setMeSrcUrl] = useState(getPath('default_profile_picture.png'))
    const [personalizedApps,setPersonalizedApps] = useState(null);
    const [checkboxes, setCheckboxes] = useState(null);
    const [isLoading,setIsLoading] = useState(true);
    const [isInputLoading,setIsInputLoading] = useState(false);
   
    
    useEffect(()=>{
        UserService.getUserSrcUrl(UserService.getTempMe().fullname).then(setMeSrcUrl);

        getPersonalizedApps(UserService.getTempMe()).then(apps=>{
            setPersonalizedApps(apps)
            let checkboxes = getCheckboxes(UserService.getTempMe(),apps)
            setCheckboxes(checkboxes)
            setIsLoading(false);
        });

    },[])// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        if(!isLoading)   inputRef.current.value= UserService.getTempMe().username; 
    },[isLoading])
    //apps

    const getPersonalizedApps =async (me)=>{
        const personalized_apps_set = new Set();

        if(me.hosts == null) throw new Error("me.hosts error")
        for(let i =0;i<me.hosts.length;i++)
        {
            let apps = await HostService.getHostPersonalizedApps(me.hosts[i])
            apps.forEach(app => {
                personalized_apps_set.add(app)
            });
        }
        return Array.from(personalized_apps_set);
    }
    const getCheckboxes=(me,all_personalized_apps)=>{
        let res = new Array(all_personalized_apps.length).fill(false)

        all_personalized_apps.forEach((app,index) => {
            if(me.personalized_apps.includes(app))
                res[index] = true;
        });
        return res;
    }

    const handleOnChange = (index,checked) => {
        if(checkboxes[index] === checked) return;
        setCheckboxes(checkboxes.map((item, i) => i === index ? !item : item));
    };

    //username

    const inputRef = useRef();
    const [isUsernameInputRed,setIsUsernameInputRed] = useState(false);
    const [isUsernameInputLoading,setIsUsernameInputLoading] = useState(false); 
    const [isUsernameSet,setIsUsernameSet] = useState(false);
    const handleOnEnter = ()=>{
        setIsUsernameInputLoading(true);
        inputRef.current.blur();
        UserService.trySetMyUsername(inputRef.current.value).then(res=>{
            setIsUsernameInputRed(!res)
            if(res)setIsUsernameSet(true);
            setIsUsernameInputLoading(false);
        })
    }

    //next

    const onNextClick= async()=>{
        setIsInputLoading(true);

        let my_personalized_apps = [];
        personalizedApps.forEach((app,index) => {
            if(checkboxes[index]) my_personalized_apps.push(app);
        });
        if(my_personalized_apps.length>0 || window.confirm("You haven't selected any app you're interested in. Continue?")) {
            await UserService.trySetMyPersonalizedApps(my_personalized_apps).then((res)=>
            {
                if(res)
                {
                    UserService.saveMe();
                    onSetup();
                }
            })
        }
        setIsInputLoading(false);
    }

    if(isLoading) return <Loading/>
    return ( 
        <div className='setup noscroll'>
            <h2 className='color-gray-solid' style={{marginLeft:"15px"}}>Welcome, {UserService.getTempMe().getName()}!<span role="img" aria-label="emoji"> ✋🏼</span></h2>
       
            <div className='setup-user'>
                <img src={meSrcUrl} alt="profile"/>
                <div>
                    <h4>Change Your Username:</h4>
                    <InputField reff={inputRef} readOnly={isUsernameSet} onEnter={handleOnEnter} isRed={isUsernameInputRed} isInputLoading={isUsernameInputLoading} />
                    </div>
               
            </div>
            {personalizedApps?.length>0 && <div className='setup-apps'>
                <h4>Select apps you interested in:</h4>
                <div className='setup-apps-list'>
                    {personalizedApps.map((appname,index)=>{
                        let app = AppService.getApp(appname);
                        return <div key={index}>
                           <Checkbox 
                             disabled={isInputLoading}
                             defaultChecked={checkboxes!==null? checkboxes[index]:false}
                             onChange={(e) => handleOnChange(index,e.target.checked)}
                           />
                            <App key={appname} application={app}/>
                            <div className='setup-app-description'>
                                <div><b>{app.name}</b></div>
                                <span className='small'>- {app.description} </span>
                            </div>
                        </div>}
                    )}
                </div>
            </div>}
            <div className='flex-center-v'>
                <ButtonNext disabled={isInputLoading} onClick={onNextClick}></ButtonNext>
            </div>
        </div>
 );
}
 
export default Setup;