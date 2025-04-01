import { GET_NOW, delay,  getMonday, toMap } from "../aFunctions";
import { DEMONOW, DEMONAME, WeekRepository } from "./aDemobase";
import { Week } from "../Objects/Week";
import { db, getDoc, getDocs } from "../Services/aFirebase";
import { Timestamp, limit, onSnapshot, orderBy, updateDoc, where } from "firebase/firestore";
import { doc} from "firebase/firestore";

export const useWeekService = (demo)=> demo ? WeekServiceDemo : WeekService;

const WeekService = {
    
    onWeekSnapshot : (host_id,week_name,onNext)=>{
        if(!host_id || !week_name) return function unsubscribe() {}
        return onSnapshot(doc(db,"hosts",host_id,"weeks",week_name),(doc)=>{console.log("Week updated");let doc_ = doc.data();doc_.id=doc.id;onNext(Week.fromDoc(doc_))});
    },

    getWeek : async (host_id,week_name,current=false)=>{ //return week or null 
        if(host_id==null || (week_name==null && !current)) return null;
        
        if(current)
        {
            let fromDate =getMonday();
            let toDate = GET_NOW();
            let docs = await getDocs(`hosts/${host_id}/weeks`,where("start_date",">=",fromDate),where("start_date","<=",toDate),orderBy("start_date","desc"),limit(1));
            if(docs.length===0) return null;
            return Week.fromDoc(docs.at(0))
        }

        let doc =  await getDoc(`hosts/${host_id}/weeks`,week_name);
        return Week.fromDoc(doc);
    },

    /*
    getWeekNames : async(host_id,from_date=null)=>{
        if(!host_id) return [];
        let docs;
        if(from_date) docs = await getDocs(`hosts/${host_id}/weeks`,where("start_date","<=",GET_NOW()),where("start_date",">=",from_date),orderBy("start_date","desc"),limit(20));
        else docs = await getDocs(`hosts/${host_id}/weeks`,where("start_date","<=",GET_NOW()),orderBy("start_date","desc"),limit(20));
        if(!docs)return [];
        return docs.map(doc=>doc.id);
    },*/

    getHostLastWeekName : async(host_id)=>{
        if(!host_id) return null;
        let toDate = GET_NOW();
        toDate.setDate(toDate.getDate() - 7);
        let fromDate =getMonday(toDate);
        let docs;
        docs = await getDocs(`hosts/${host_id}/weeks`,where("start_date",">=",fromDate),where("start_date","<=",toDate),orderBy("start_date","desc"),limit(1));
        if(docs?.length<1)return null;
        return docs.at(0).id;
    },

    trySetHostWeekScreenkaView : async (host_id,week_name,user_fullname)=>{
        let data;
        data[`screenka_views.${user_fullname}`] = { view_date:Timestamp.fromDate(GET_NOW()), };
        await updateDoc(doc(db,`hosts/${host_id}/weeks/${week_name}`),data);
        return true;
    }

}

const WeekServiceDemo = {
    onWeekSnapshot : (host_id,week_name,onNext)=>{
        let isSubscribed = true;

        async function subscribe() {
            
            while (isSubscribed) {
                let snapshot = await WeekServiceDemo.getWeek(host_id,week_name);
                snapshot=Object.assign({}, snapshot);
                onNext(snapshot);

                snapshot = await WeekServiceDemo.getWeek(host_id,week_name);
                snapshot=Object.assign({}, snapshot);
                await delay(3000);
                snapshot.today_apps_counts = toMap({Spotify:2,Maps:1,Safari:1,Photos:1});
                snapshot.latest_post = {user:"Tola Bajka", date:DEMONOW};
                snapshot.today_participants = [DEMONAME,"Mia Muller","Tola Bajka"];
                onNext(snapshot);

                isSubscribed=false;
            }
        }

        subscribe();

        return function unsubscribe() {
            isSubscribed = false;
        };
    },

    getWeek : async (host_id,week_name,current=false)=>{ //return week or null or undefined
        await delay(500)
        return WeekRepository[0];
    },

    /*
    getWeekNames : async (host_id,from_date=null)=>{
        await delay(1500)
        return [WeekRepository[0].name];
    },*/

    getHostLastWeekName : async(host_id)=>{
        await delay (1000);
        return WeekRepository[0].name;
    },

    trySetHostWeekScreenkaView : async (host_id,week_name,user_fullname)=>{
        //TODO
        return true;
    }

}