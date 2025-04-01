import React, { useState } from "react";
import { AboutApp, AboutAppMini, AboutEvent, AboutScreenka, AboutUserMini } from "./aAbouts";

export const BottomTabContext = React.createContext();

export const BottomTabProvider = ({children}) => {

    /* 
    Template             {id, object, ...}
    AboutAppMini    {0 ,app, total_uploads}
    AboutApp            {1,app,appType}
    AboutUserMini   {2, user_fullname, since_week, role}
    AboutEvent            {3, event}
    AboutScreenka   {4}
    */
    
    const [object,setObject] = useState(null);

    const setBottomTab = (object) =>{ setObject(object) }
    const closeBottomTab = ()=>{ if(object!==null) setObject(null);}
    const isBottomTab = ()=>object!==null
    const getObject = ()=>{return object?.object}
    const equalObject = (object2) => {return object?.object===object2}

    const value = {
        setBottomTab,
        closeBottomTab,
        isBottomTab,
        getObject,
        equalObject,
    }

    return ( 
    <BottomTabContext.Provider value={value}>
         
        <div onClick={()=>closeBottomTab()}>
            {children}
        </div>

        {object && object.id === 0 && <AboutAppMini app={object.object} totalUploads={object.total_uploads} onClose={()=>setObject(null)}/>}
        {object && object.id === 1 && <AboutApp app={object.object} appType={object.app_type} onClose={()=>setObject(null)}/>}
        {object && object.id === 2 && <AboutUserMini user_fullname={object.object} since_week={object.since_week} role={object.role}  onClose={()=>setObject(null)}/>}
        {object && object.id === 3 && <AboutEvent event={object.object}  onClose={()=>setObject(null)}/>}
        {object && object.id === 4 && <AboutScreenka onClose={()=>setObject(null)}/>}
        {/*... other BottomTabs  */}
    </BottomTabContext.Provider> );
}