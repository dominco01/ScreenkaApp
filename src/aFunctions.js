//CONSTS
export const MAX_ST_VIEWS = 1;
export const MAX_TICKETS = 3;
export const DAY_EVENT_POSTS = 3;
export const GET_NOW = ()=> new Date(Date.now()) ; //new Date(2021,3,3,10,10)

//PATH
export const getPath=(file)=>{
    return `${process.env.PUBLIC_URL}/assets/${file}`
}

export const getAppFullSrc=(app_name,size=64)=>{
    if(size<=64) return getPath("app-logos-128/"+app_name.toLowerCase().replace(" ","_")+"64.jpg")//!
    return getPath("app-logos-128/"+app_name.toLowerCase().replace(" ","_")+".jpg")
}

//ASYNC

export function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

//Week Day
export const WeekDay = {"Monday":0, "Tuesday":1, "Wednesday":2, "Thursday":3, "Friday":4, "Saturday":5, "Sunday":6}

export const toWeekDay = (obj)=>{//string or number
  if(typeof obj === 'string')
    return WeekDay[obj]; //tu numerek zwraca  lool

  if(obj>=0 && obj<=6)
    return Object.keys(WeekDay).find(key => WeekDay[key] === obj) //tu nazwe zwraca loool
  return undefined
}

export const dateToWeekDay = (date=GET_NOW()) =>{//return string 
  let index= (date.getDay()+6)%7;
  return toWeekDay(index);
}

//DATE
export const MonthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];

export const isDayToday=(dayIndex)=>{ return (GET_NOW().getDay()+6)%7 === dayIndex;}

export const dayIndexToday=()=>{ return (GET_NOW().getDay()+6)%7 }

export function getMonday(d=null) {
    d =d? new Date(d): GET_NOW();
    d.setHours(0,0,0,0);
    var day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

export function dayEqual(instancedate1, instancedate2) {
    return instancedate1.getFullYear() === instancedate2.getFullYear() &&
    instancedate1.getMonth() === instancedate2.getMonth() &&
    instancedate1.getDate() === instancedate2.getDate()
}
export function weekEqual(date1, date2) {
    return datesWeekDelta(date1,date2)===0;
}

const isBetweenHour = (fromHour,toHour)=>{
    let hour=GET_NOW().getHours();
    return fromHour<=hour && hour<toHour;
}

export const isTime=(weekIndex,fromHour,toHour) =>{
    if(weekIndex==null) return isBetweenHour(fromHour,toHour);
    if(!isDayToday(weekIndex)) return false;
    if(!isBetweenHour(fromHour,toHour)) return false;
    return true;
}
 
export const isAfterTime=(weekIndex,toHour) =>{
    if(weekIndex!=null && !isDayToday(weekIndex)) return false;
    return GET_NOW().getHours()>= toHour;
}

export const dateToHourString = (date, pretty=false)=>{ //prettier version of date
    if(pretty && isLessThenMinutes(date,15)) return "NOW";
    if(pretty && isLessThenMinutes(date,59)) return `${datesMinuteDifference(date)}MIN AGO`;
    if(pretty && isLessThenMinutes(date,60+59)) return "1H AGO";
    return (
        date.getHours().toLocaleString('en-US', { minimumIntegerDigits: 1, useGrouping: false })+ ":"+ 
        date.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }))
}

export const datesWeekDelta = (date1,date2)=>{
    date1 = getMonday(date1);
    date2 = getMonday(date2);
    let dayDelta = Math.ceil((date1.getTime()-date2.getTime()) / (1000 * 3600 * 24));
    dayDelta = Math.abs(dayDelta);
    return Math.floor(dayDelta/7);
}

export const isLessThenMinutes = (date,minutes)=>{
    if(date==null || minutes==null) return false;
    var diff = datesMinuteDifference(date)
    if(diff<0) return false;
    return minutes >= diff;
}

export const datesMinuteDifference=(date_past,date=GET_NOW())=>{
    var diff = date - date_past;
    return Math.floor((diff/1000)/60);
}

export const YY_MMDD_HHMM=(date)=>{
    function pad2(n) {  return (n < 10 ? '0' : '') + n; }
    if(!date) date=GET_NOW();
    return (date.getFullYear()%100) +"_"+
        pad2(date.getMonth() + 1) + 
        pad2(date.getDate()) +"_"+
        pad2(date.getHours()) +
        pad2(date.getMinutes())
}

//RANDOM
export const randomElement = (array)=>{
    if(!array || array.length===0) return null;
    return array[Math.floor(Math.random() * array.length)];
}

export const randomElements=(array,size)=>{
    if(!array || array.length===0) return null;
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, size);
}

//MAP
export const toMap=(doc={})=>{
    const map = new Map();
    Object.entries(doc).forEach(([key, value]) => { map.set(key, value) });
    return map;
}
/*
export const fromMap = (map)=>{
    const firestoreMap = {};
    map.forEach((value, key) => {
    firestoreMap[key] = value;
    });
    return firestoreMap;
}*/

//name
export const shortenFullname=(fullname)=>{
    let splits = fullname.split(" ");
    splits = splits.map((split,i)=>{return i===0?split:(split.charAt(0)+".")})
    return splits.join(" ");
}

//me friends screenka

export const objectToPermissions = (obj,old_permissions={me:false,friends:false,screenka:false})=>{
    if(!obj) return old_permissions;
    return {
        me: obj.me==null? old_permissions.me : (obj.me===true ? true : false),
        friends: obj.friends==null? old_permissions.friends : (obj.friends===true ? true : false),
        screenka: obj.screenka==null? old_permissions.screenka : (obj.screenka===true ? true : false),
      };
}