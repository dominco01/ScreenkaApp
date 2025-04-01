import React, { useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom/dist';
import ScreenkaT0 from '../aScreenkas/ScreenkaT0';
import { AuthContext } from '../Contexts/AuthContext';
import NothingToShow from './NothingToShow';
import ScreenkaTDEMO from '../aScreenkas/ScreenkaTDEMO';
import { Event } from '../Objects/Event/_Event';

const HANDLING_EVENT = "screenkatygodnia"; 

const Screenka = () => {
    const {host_id} = useParams();
   
    const navigate = useNavigate();

    const {user,week,WeekService,PostService,HostService,EventService} = useContext(AuthContext);

    const onLoad= async (week_name)=>{
      if(week_name !== week?.name) {navigate("/");return;}

      let event = EventService.getMyInteractiveEvent(HANDLING_EVENT);
      if(!Event.canInteract(event,{week:week}))  {navigate("/");return;}
      
      if(!user || !user.hosts?.includes(host_id))  {navigate("/");return;}
      
      HostService.getHostPersonalizedApps(host_id).then(apps=>{  PostService.setHideIfAppsState(user,apps); });

      return setTimeout(()=>{
        let is_new = Event.setInteraction(event)
        if(is_new) WeekService.trySetMyScreenkaView(host_id,week_name).then(res=>console.log(res?"Screenka View has been set":"Screenka View hasnt been set"))
      },3000);
    }

    const getContent = ()=>{switch (host_id){
      case "-1": return <ScreenkaTDEMO/>
      case "0": return  <ScreenkaT0 onLoad={onLoad}/>
      default: return <NothingToShow/>
    }}

    return (<div className='noselect'>
      {getContent()}
    </div>)
    
  
}
 
export default Screenka;