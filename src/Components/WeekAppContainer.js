import React, { useContext, useEffect, useMemo, useState } from 'react';
import AppContainer from './AppContainer';
import { AuthContext } from '../Contexts/AuthContext';
import { AppClass } from '../Objects/App/AppClass';

const APPS_SIZE = 6;

const WeekAppContainer = ({host_id, week_name}) => {
    const{WeekService,AppService} = useContext(AuthContext);

    const [appsCounts,setAppsCounts] = useState(new Map())

    useEffect(()=>{
       if(week_name && host_id) WeekService.getWeekAppsCounts(host_id,week_name).then(counts=>setAppsCounts(counts))
    },[week_name,host_id])

    const apps = useMemo(()=>{
        let arr= Array.from(appsCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, APPS_SIZE)
            .map(([app_name, ]) => AppService.getApp(app_name));
        while(APPS_SIZE > arr.length) arr.push(AppClass.Default);
        return arr;
    },[appsCounts])

    return (  
    <div style={{padding:"10px"}}>
        <AppContainer apps={apps} notificationCountsMap={appsCounts} />
    </div> );
}
 
export default WeekAppContainer;