import { PostClass as Post } from "../Objects/Post/PostClass"
import { Host } from "../Objects/Host"
import { UserClass } from "../Objects/User/UserClass"
import { Week } from "../Objects/Week"
import { toMap } from "../aFunctions";

export const DEMONOW = new Date(2023,4-1,24,20,17);
export const DEMONAME = "Demo User"
export const DEMOFUNNYNAME = "demo_user"

export const PostRepositoryMap = new Map([
    [DEMONAME,[
    new Post("dsnanaaiaocsn","-1","Glassy Week",new Date(2023,4-1,24,14,0),"Photos",null,"To wszystko sie tu zaczelo!",{me:true,friends:true,screenka:true},true,null,"Tola Bajka",1),
    new Post("dsnanaaiasasa","-1","Glassy Week",new Date(2023,4-1,24,15,0),"Safari","https://open.spotify.com/track/2dHHgzDwk4BJdRwy9uXhTO","Ta storna to majstersztyk",false,{me:true,friends:true,screenka:false},null,null,null,null),
    new Post("dsnasddsxccsn","-1","Glassy Week",new Date(2023,4-1,24,16,16),"Notes","Ciekawski","Ciekawe slowo w sumie",{me:true,friends:true,screenka:true},false,null,null,null,null),
    ]],
    ["Tola Bajka" ,[
    new Post("123123","-1","Glassy Week",new Date(2023,4-1,24,20,10),"Maps","Paryz Francja","Piekne miejsce! Polecam! Cieplutko!",{me:true,friends:true,screenka:true},false,null,DEMONAME,2),
    ]], 
    ["Mia Muller",[
    new Post("123","-1","Glassy Week",new Date(2023,4-1,24,14,30),"Spotify","https://open.spotify.com/track/2dHHgzDwk4BJdRwy9uXhTO","Hejka!",{me:true,friends:true,screenka:true},true,null,null,null),
    ]]])
export const UserRepository = [
    new UserClass(DEMONAME,DEMOFUNNYNAME,"DemoUser",["-1"],{me:true,friends:true,screenka:true},["Maps"]),
    new UserClass("Tola Bajka","bayka","Bayka",["-1"],{me:true,friends:true,screenka:true}),
    new UserClass("Mia Muller","miam","Miam",["-1"],{me:true,friends:true,screenka:true})
]

let week =new Week("Glassy Week",new Date(2023,4-1,24,8,0),"New week, new you. Have fun. We are waiting for some new fresh and dope things! Use your glasses against burning sun! ...","🕶️",null,null,null,true);
week.today_participants= [DEMONAME,"Mia Muller"];
week.today_apps_counts =  toMap({Spotify:1,Maps:1,Safari:1,Photos:1});
week.total_uploads = 4;
week.apps_counts = toMap({Spotify:1,Maps:1,Safari:1,Photos:1});
export const WeekRepository =[week];

const subscribers = new Map([
    [DEMONAME, {join_date:new Date(2023,4-1,17), role:"host"}],
    ["Tola Bajka",{join_date:new Date(2023,4-1,17)}],
    ["Mia Muller", {join_date:new Date(2023,4-1,17)}]
])

export const HostRepository = [ new Host("-1",DEMONAME,new Date(2023,4-1,10),
["Notes", "Safari","Photos","Youtube","Spotify","Contacts"],
["Maps","Instagram","Camera"],null,new Map([["SuperGroup",[DEMONAME,"Tola Bajka"]]]),subscribers)] 



