import React from 'react';
import "./styles/ScrollDiv.css"

//UWAGA!!! w srodku wsadza sie diva, h1, span cos co jest jakims elementem (a nie string)
const ScrollDiv = ({children,style}) => { 
    return ( 
        <div className='scrolldiv-pre'>
            <div className='noscroll scrolldiv' style={style}>
                {children}
            </div>
        </div>
        
     );
}
 
export default ScrollDiv;

// style={right?{direction:'rtl'}:{}}