import React, { useState } from 'react';

const Dot = ({children,disabled, onClick=undefined,orange=false,style}) => {

    const [clickerState,setClickerState] = useState(false); //jesli nie ma onClick, to mozesz sobie przeklikiwac clicka

    return ( <span 
        className={
            "noselect circle"+
            (!disabled?(" color-black clickable"+(orange?" bcolor-orange":" bcolor-green-solid")):" bcolor-dark-gray-solid")+
            (clickerState?" opacity":"")
        } 
        onClick={!disabled? onClick?onClick: ()=> setClickerState(!clickerState) : undefined}
        style={style}
        >
            {children}
        </span> );
}
 
export default Dot;