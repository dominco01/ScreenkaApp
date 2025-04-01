import React from 'react';
import Post from '../Objects/Post/Post';
import "./Screenka.css"
import { DEMONAME } from '../Services/aDemobase';
import WeekAppContainer from '../Components/WeekAppContainer';

const ScreenkaTDEMO = () => {
    
    return ( 
    <div className='Screenka'>

        <div style={{display:'flex',justifyContent:'center'}}>
        <h1 style={{opacity:'0.2',marginRight:"3px"}}>Screenka<br/>Tygodnia</h1>
        <h1>Screenka<br/>Tygodnia</h1>
        <h1 style={{opacity:'0.2',marginLeft:'3px'}}>Screenka<br/>Tygodnia</h1>
        </div>
        
        <h5 style={{textAlign:"center",opacity:'0.6'}}>#1 GLASSY WEEK<br/>APRIL 2023</h5>
        <br/>      <br/>
        <h3>Witamy! Nastepny tydzien za nami, a co za tym idzie kolejne wydanie Screenki! Kazdy w okularach? Nie sadzilismy ze u wszystkich tak zle ze wzrokiem...</h3>
        <br/>
        <h2 >Oto nasze wyniki:</h2>
        <WeekAppContainer host_id={'-1'} week_name={'Glassy Week'}/>
        <br/><br/>
        <h2 >Poniedziałek</h2>
        <h4 >A wszystko zaczęlo sie od...</h4>
        <Post id="dsnanaaiaocsn" user_fullname={DEMONAME}/>
        <h4>To co dzis przygotowalismy jest genialne! SmiSAMdiasmd isamdsa iasmd isadasnd ldsanf mdsafsadvinafdsg agf lorem</h4>

        <Post id="123123" user_fullname="Tola Bajka"/>
        <footer style={{marginTop:"50px"}}>Screenka Tygodnia ™</footer>
    </div> );
}
 
export default ScreenkaTDEMO;