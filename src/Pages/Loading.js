import React from 'react';
import { getPath } from '../aFunctions';
import pack from "../../package.json"
const Loading = ({logo=false}) => {

    if(logo)
        return (<div style={{display:"flex",flexDirection:"column"}}>
            {<div className='centered'> <img className='fromdown' alt="logo" src={getPath("st-logo.png")} style={{width:"200px"}}/></div>}
            <footer className='center'>v{pack.version}</footer>
        </div>)


    return ( <div>
        <div className="centered">Loading...</div>
        </div> );
}
 
export default Loading;