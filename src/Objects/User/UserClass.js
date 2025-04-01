import { shortenFullname } from "../../aFunctions";

export class UserClass{
    constructor (
        fullname,funnyname,username, hosts, preferences, //required
        personalized_apps=[],super_personalized_apps=[]//optional
        )
    {
        /***/ this.fullname = fullname; //name + surname
        this.funnyname = funnyname; //to login
        this.username=username; 
        this.hosts=hosts;
        this.preferences=preferences?preferences:{me:false,friends:false,screenka:false}; //{me,friends,screenka} - jesli null to domyslnie wszystkie true
        
        this.personalized_apps=personalized_apps;
        this.super_personalized_apps=super_personalized_apps; // customowe aplikacje np. Changelog App, nie widniejace nigdzie, na zamowienie
    }

    getName = () => this.fullname.split(" ")?.at(0);
    getShortenFullname=()=>shortenFullname(this.fullname);

    static fromDoc=(doc)=>{
        if(!doc)return null;
        return new UserClass(doc.id? doc.id: doc.fullname,doc.funnyname,doc.username,doc.hosts,doc.preferences,doc.personalized_apps,doc.super_personalized_apps);
    }
}   