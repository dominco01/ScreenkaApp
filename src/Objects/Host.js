import { MAX_TICKETS, toMap } from "../aFunctions";

export class Host {
    constructor(id,fullname,start_date,popular_apps,//required
      personalized_apps=[],group_apps=[],groups=new Map(), subscribers=new Map()//optional
      ) { 
      /***/ this.id = id; //auto
      this.fullname = fullname;
      this.start_date = start_date;
      
      this.popular_apps = popular_apps; // takie co kazdy bedzie widzial posty z nich (bo sa uniwersalne, i nieprzewidywalne)
      this.personalized_apps = personalized_apps;// for personalized use, posty takich aplikacji trafiaja max do znajomych
      this.group_apps = group_apps;
      this.groups = groups; // zakladamy ze jest scisle powiazane z subscribersami > see SOON
      this.subscribers = subscribers;  //fullname => join_date,role,leave_date
                                                        //jesli tu cie nie ma a masz Host w user/Hosts to znaczy ze masz bana, ale luz nic wielkiego, po prostu postowac nie mozesz, najwyrazniej jakos sie niewlasciwie zachowywales
                                                        // w miare bedzie sie pokrywalo z host.friends
                                                        // ale jednym powodem zastosowania jest to ze na poczatku nie mozemy wszystkich friendsow poznac i to stopniowo bedziemy dodawac koleno
      this.max_tickets = MAX_TICKETS;
    }

    getFriends =(fullname)=>{//return array
      let res = [];
      this.groups.forEach((members) => {
        if(members.includes(fullname))
        {
          members.forEach(member=>{
            if(member!==fullname && !res.includes(member)) res.push(member);
          })
        }
      });
      return res;
    }

    getMyGroups = (fullname)=>{//return array
      if(!fullname) return null;
      let res = [];
      this.groups.forEach((members, group_name) => {
        if(members.includes(fullname)) res.push(group_name);
      })
      return res;
    }

    static fromDoc=(doc)=>{
      if(!doc) return null;

      let subscribers = toMap(doc.subscribers);
      subscribers.forEach((value,)=>value.join_date= value.join_date.toDate());
      subscribers.forEach((value,)=>value.leave_date= value.leave_date?.toDate());

      return new Host(doc.id, doc.fullname,doc.start_date.toDate(),doc.popular_apps,doc.personalized_apps,doc.group_apps,toMap(doc.groups),subscribers);
  }
}
