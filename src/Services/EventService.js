import { CustomEvent } from "../Objects/Event/CustomEvent";
import { DayEvent } from "../Objects/Event/DayEvent";
import { Events } from "./aLocalbase";

export const useEventService = ()=> EventService

const EventService = {
    getAvailableDayEvents : (weekNumber=0,for_, force_all=false) => {
        let day_events = Object.values(Events).filter(event => event.constructor === DayEvent);
        let arr = getAvailableEvents(day_events,weekNumber,for_,force_all)
        return arr.filter((event,index) => arr.findIndex((e) => e.name === event.name) === index);
    }
    ,
    getAvailableCustomEvents : (weekNumber=0,for_, force_all=false) => {
        let custom_events = Object.values(Events).filter(event => event.constructor === CustomEvent);
        return getAvailableEvents(custom_events,weekNumber,for_,force_all)
    }
};

const getAvailableEvents = (events,weekNumber=0,for_, force_all=false) => force_all? events : events.filter((event)=> event.isAvailable(weekNumber,for_));
