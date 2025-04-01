import { GET_NOW, isLessThenMinutes } from "../../aFunctions";
import { weekEqual } from "../../aFunctions";
import { dayEqual } from "../../aFunctions";

export const EventFor = {me:0,friends:1,screenka:2}
export const EventExperience = { None:0, Informative:1 ,  Interactive:2 , Full:3}
export const EventResetViewsAfter ={Now:0,Week:1,Day:2,FifteenMinutes:3,Session:4,Reload:5}

export class Event {
    #experience;
    reload_views_count = 0; //counter for reset after reload type
    
    constructor(name, description="", for_=null, fromWeekNumber=0,experience=EventExperience.None, max_views=null, reset_views_after=null) 
    {
        this.name = name;
        this.description = description;
        this.for = for_;
        this.fromWeekNumber = fromWeekNumber;
        this.#experience = experience;
        this.max_views = max_views;
        this.reset_views_after = reset_views_after;
    }

    checkPermissions = ({me,friends,screenka}) => (this.for === EventFor.me && me === true) ||  (this.for === EventFor.friends && friends === true)  ||  (this.for === EventFor.screenka && screenka === true);
    isTime = ()=> false;
    toString=()=> this.name.replace("-","").replace(" ","").toLowerCase()
    getSubtitle= ()=>"";
    getNote = ()=>null;

    isAvailable = (weekNumber,for_) => !for_? false : (weekNumber>=this.fromWeekNumber && this.checkPermissions(for_));
    isInformative = ()=> [EventExperience.Informative,EventExperience.Full].includes(this.#experience);
    isInteractive = ()=> [EventExperience.Interactive,EventExperience.Full].includes(this.#experience);

    //dlaczego static? ta sama nazwa eventu bedzie traktowana tak samo 
    //dlaczego tak chcemy robic? bo np. DeadLine, i DeadLineForMe to z definicji rozne eventy, a jednak maja wplywac na siebie (views).
    static canInteract = (event,props)=>{ //props for CustomEvents
        if(!event || !event.isInteractive()) return false;
        if(!event.isTime(props)) return false;
        if(event.max_views==null || event.reset_views_after==null) return true;
        if(event.reset_views_after===EventResetViewsAfter.Reload) return event.max_views > this.reload_views_count;

        if(event.max_views>1)   {
            let count_str = getEventStorage(event).getItem(`${event}_count`);
            if(!count_str || Number(count_str)< event.max_views) return true;
        }
        return isDiffTill(event);
    }
    static setInteraction = (event) =>{ //returns true if newly created
        if(!event || !event.isInteractive()) return false;

        if(event.reset_views_after===EventResetViewsAfter.Reload){
            return this.reload_views_count++ === 0; 
        }

        let storage = getEventStorage(event);
        if(event.max_views) storage.setItem(`${event}_view`,GET_NOW());
        if(event.max_views && event.max_views>1) {
            let clear_count =  isDiffTill(event);
            let count_str = storage.getItem(`${event}_count`);
            storage.setItem(`${event}_count`,(count_str && !clear_count) ?(Number(count_str)+1):1)
            return !count_str || clear_count;
        }
        return false;
    }
}

//czy jest roznica w weeku/dniu/minutach
const  isDiffTill = (event)=>{
    let date = getEventStorage(event).getItem(`${event}_view`); 
    date = new Date(date);  

    switch(event.reset_views_after) {
        case EventResetViewsAfter.Week:
            return !weekEqual(date,GET_NOW());
        case EventResetViewsAfter.Day:
            return !dayEqual(date,GET_NOW());
        case EventResetViewsAfter.FifteenMinutes:
            return !isLessThenMinutes(date,15);
        case EventResetViewsAfter.Now:
            return true;
        case EventResetViewsAfter.Session:
            return date!==null;
        default:
            return false;
    }
}

const getEventStorage = (event)=>{
    let session = event.reset_views_after === EventResetViewsAfter.Session;
    return session ? sessionStorage : localStorage
}