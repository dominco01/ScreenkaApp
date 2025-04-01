import React from 'react';
import "./styles/A.css"

const A = ({
        className="", bold,underline,red=false,orange=false,nocolor=false,
        onClick,disabled=false,active=true,
        children
    }) => {
    
    nocolor = nocolor || !onClick;
    
    return ( <span className={"A noselect "+className+(nocolor?"":(red?" color-red ":(orange?" color-orange ":" color ")))+(underline?' underline':" ")+((disabled||!active)?" opacity":"")+(onClick?"":" noclick")} 
    style={bold?{fontWeight:"bold"}:{}}
    onClick={(!onClick || disabled)? undefined :()=> onClick()}>{children}</span> );
}
 
export default A;