import { GET_NOW, dateToWeekDay, toMap } from "../aFunctions";

export class Week{
    constructor(  name,start_date,  description,emoji, //required
                            blocked_apps=[], extra_apps=[], max_tickets=null, force_st=false,//optional
                        ) 
    {
        /***/ this.name = name; //gdy bedziemy chcieli sobie wziac po week_namie z posta,
        this.start_date = start_date; // filtrujemy czy currweekdate===newdate, filtrujemy po datach ktore so przed teraz, a pozniej sortujemy po najwyzszej i nia bierzemy - tym samym nowy week odbedzie wtedy kiedy start_date - wraz ze screenka!
        this.description = description; // opis tygodnia, zawierac moze uwagi tygodnia np. spersonalizuj by dodac settingsy! (wejdz na /login)
        this.emoji = emoji;

        /*?*/ this.blocked_apps = blocked_apps; //- np. #1 week bez person section , innego robisz zen-week itp. 
        /*?*/ this.extra_apps = extra_apps; // sa one jakby popular apps
        this.max_tickets = max_tickets;//- np. 1 (one-ticket-week), 5 (dla wiekszych kontenciarzy) / jesli nie ma weeka, i ograniczenie sie pozniej pojawi, to good for you (goscia co zapostowal juz z 3 ticketami.. prawdziwy fan co postuje juz od poczatku tygodnia!...
        this.force_st = force_st;

        //realtime
        this.today_participants = [];
        this.today_apps_counts = new Map(); //map
        this.apps_counts = new Map(); //map, total counts for app, ala week_apps_counts
        this.total_uploads = 0; // ala week_total_uploads
        this.latest_post = {}; // {date, user}
        this.screenka_views = new Map(); // user_fullname => view_date
        
        //realtime references
        this.screenka_comments = [];//ref
        this.events = []; // ref      
    }

    static DefaultWeek = new Week("Week",GET_NOW(),"Default Week","")

    setTodayAppsCounts=(day_apps_counts)=>{
        const calcAppsCounts = (day_apps_counts)=>{
            return Object.values(day_apps_counts).reduce((acc, day) => {
                Object.entries(day).forEach(([app, count]) => {
                    if (acc.has(app)) acc.set(app, acc.get(app) + count);
                    else acc.set(app, count); 
                });
                return acc;
            }, new Map());
        }
        if(!day_apps_counts) return;
        //additional
        this.total_uploads = Object.values(day_apps_counts).reduce((acc, apps_counts)=> acc + Object.values(apps_counts).reduce((acc, counts) => acc + counts, 0),0);
        this.apps_counts = calcAppsCounts(day_apps_counts);
        //today
        let today_apps_counts = day_apps_counts[dateToWeekDay(GET_NOW())];
        if(today_apps_counts) this.today_apps_counts = toMap(today_apps_counts);
        return this;
    }

    setTodayParticipants=(day_participats)=>{
        if(!day_participats) return;
        let today_participants = day_participats[dateToWeekDay(GET_NOW())];
        if(today_participants) this.today_participants = today_participants;
        return this;
    }

    static fromDoc=(doc)=>{
        if(!doc) return null;

        let screenka_views = toMap(doc.screenka_views);
        screenka_views.forEach((value,)=>value.view_date= value.view_date.toDate());

        let latest2 = doc.latest_post
        if(latest2) latest2.date = latest2.date.toDate();

        let res =  new Week(doc.id,doc.start_date.toDate(),doc.description,doc.emoji,doc.blocked_apps,doc.extra_apps,doc.max_tickets,doc.force_st,);
        res.latest_post = latest2;
        res.screenka_views = screenka_views;
        res.screenka_comments = doc.screenka_comments;
        res.events = doc.events;
        res.setTodayAppsCounts(doc.day_apps_counts)
        res.setTodayParticipants(doc.day_participants)
        return res;
    }
}