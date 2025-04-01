import React, { useEffect } from 'react';
import Post from '../Objects/Post/Post';
import "./Screenka.css"
import WeekAppContainer from '../Components/WeekAppContainer';

const WEEK_NAME = "First Week";
const HOST_ID = "0";

const ScreenkaT0 = ({onLoad}) => {
   
    useEffect(()=>{
        const timeout = setTimeout(()=> onLoad(WEEK_NAME),1000);
        return ()=>clearTimeout(timeout);
    },[])// eslint-disable-line react-hooks/exhaustive-deps

    return ( 
        <div className='Screenka'>
            <div style={{display:'flex',justifyContent:'center'}}>
            <h1 style={{opacity:'0.2'}}>Screenka<br/>Tygodnia</h1>
            <h1>Screenka<br/>Tygodnia</h1>
            <h1 style={{opacity:'0.2'}}>Screenka<br/>Tygodnia</h1>
            </div>
            
            <h5 style={{textAlign:"center",opacity:'0.6'}}>#1 GLASSY WEEK<br/>APRIL 2023</h5>
            <br/>      <br/>
            <h3>Witamy! Nastepny tydzien za nami, a co za tym idzie kolejne wydanie Screenki! Kazdy w okularach? Nie sadzilismy ze u wszystkich tak zle ze wzrokiem...</h3>
            <h2>Oto nasze wyniki:</h2>
            <br/>
            {/*<WeekAppContainer host_id={HOST_ID} week_name={WEEK_NAME}/>*/}
            <br/><br/>
            <h2>Poniedziałek</h2>
            <h4>A wszystko zaczęlo sie od...</h4>
            <footer style={{marginTop:"50px"}}>Screenka Tygodnia ™</footer>
        </div> );
}
 
export default ScreenkaT0;