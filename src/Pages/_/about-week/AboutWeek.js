import "./AboutWeek.css"
import React, { useContext, useMemo, useState } from 'react';
import { getMonday , isDayToday, MonthNames, WeekDay} from "../../../aFunctions";
import { BottomTabContext } from "../../../Contexts/BottomTabContext";
import A from "../../../Components/A";
import { ButtonPrevPage } from "../../../Components/Buttons";
import { AuthContext } from "../../../Contexts/AuthContext";
import ScrollDiv from "../../../Components/ScrollDiv";
import Dot from "./components/Dot";

const AboutWeek = ({onClose}) => {
    const {setBottomTab,isBottomTab} = useContext(BottomTabContext);
    const {week,HostService,EventService} = useContext(AuthContext);

    //only events informative events
    const weekDayEvents= useMemo(()=> Object.entries(WeekDay).map(([weekDayName,weekDayIndex])=>{return {day_name:weekDayName,events:EventService.myDayEvents.filter(event=>event.weekDay === weekDayIndex).filter(event=> event.isInformative()),disabled_events:EventService.disabledDayEvents.filter(event=>event.weekDay === weekDayIndex).filter(event=> event.isInformative())}}),[EventService.myDayEvents?.length,EventService.disabledDayEvents?.length])
    const everyDayEvents= useMemo(()=>EventService.myDayEvents.filter(day=>day.weekDay===null).filter(event=> event.isInformative())  ,[EventService.myDayEvents?.length])
    const disabledEveryDayEvents= useMemo(()=>EventService.disabledDayEvents.filter(day=>day.weekDay===null).filter(event=> event.isInformative()) ,[EventService.disabledDayEvents?.length])
    const customEvents = useMemo(()=>EventService.myCustomEvents.filter(event=>event.isInformative()),[EventService.myCustomEvents])
    const [isDayLetter,setIsDayLetter] = useState(true)

    const spanDate = (weekDayName)=>{
        if(isDayLetter || !week)  return weekDayName.charAt(0);
        let date = getMonday(week.start_date);
        date.setDate(date.getDate() + WeekDay[weekDayName])
        return date.getDate();
    }

    const footer = useMemo(()=>{
        if(!week) return "";
        let date = getMonday(week.start_date);
        let month_date_string =(MonthNames[date.getMonth()].toUpperCase()+" "+date.getFullYear());
        return (
        <footer>
            {month_date_string}<br/>
            TOTAL UPLOADS: {week.total_uploads}
        </footer>)
    },[week?.total_uploads])

    return (
        <div className={"aweek "+( isBottomTab()?'noclick aweek-blur-dark':"")}>
        <ScrollDiv >
        <h1>
            <ButtonPrevPage onClick={onClose}>{"#"+(HostService.weekNumber?HostService.weekNumber:0)}</ButtonPrevPage>
            <span className={"color-blue-highlight"}>{week? week.name.toUpperCase(): "WEEK"}</span>{/* (week?.name.length>12 ? " spansmall":" span") */}
            {week && <span role="img" aria-label="emoji">{week.emoji}</span>}
        </h1>
        </ScrollDiv>
    
        <div className="description initial-letter">{week?week.description:""}</div>
        <div className="aweek-calendar">
            <div className="aweek-rows">   

            {weekDayEvents.map(({day_name,events,disabled_events}) => 
           <div key={day_name} >
                <div>
                    {events.map((event,index)=> 
                    <A key={index} active={!event.isAfterTime()} onClick={isDayToday(WeekDay[day_name]) ? ()=> setBottomTab({id:3,object:event}) : undefined}>
                            {index!==0 && ", "}
                            {event.name.toUpperCase()}
                            {events.length>0 && disabled_events.length>0 && ', '} 
                    </A>)}
                   
                    {disabled_events.map((event,index)=> 
                    <A key={index} disabled>
                            {index!==0 && ", "}
                            {event.name.toUpperCase()}
                    </A>)}
                </div>

                <Dot disabled={!isDayToday(WeekDay[day_name])} onClick={(week && isDayToday(WeekDay[day_name])) ? (()=>setIsDayLetter(!isDayLetter)): undefined}>{spanDate(day_name)}</Dot>
            </div>
               )}

            <div>{/*EMPTY SLOT*/}
                <div></div> 
                <Dot style={{opacity:"0"}} disabled/>
            </div>
            
            {(everyDayEvents.length>0 || disabledEveryDayEvents.length>0) && <div style={{maxWidth:'100%'}}>
                    {everyDayEvents.map((event,index)=>
                    <A key={index} active={!event.isAfterTime()} onClick={()=>setBottomTab({id:3,object:event})}>
                            {index!==0 && ', '}
                            {event.name.toUpperCase()}
                            {everyDayEvents.length>0 && disabledEveryDayEvents.length>0 && ', '}
                    </A>)}
                    {disabledEveryDayEvents.map((event,index)=> 
                    <A key={index} disabled>
                            {index!==0 && ", "}
                            {event.name.toUpperCase()}
                    </A>)}
                <Dot/>
            </div>}
        
            {customEvents.length>0 &&<div>
                    {customEvents.map((event,index)=>
                    <A key={index} orange onClick={()=>setBottomTab({id:3,object:event})}>
                        {index!==0 && ', '}
                        {event.name.toUpperCase()}
                    </A>)}
                <Dot orange/>
            </div>}
        
            </div>
            <div className="bcolor-dark-gray-solid"></div>
        </div>
        {footer}
        </div> 
    );
}
 
export default AboutWeek;

