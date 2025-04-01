import { useNavigate } from "react-router-dom";
import "./styles/Buttons.css"
import React from 'react';

export const ButtonClose = ({onClick,style}) =>{

    return (
    <button className="button-close bcolor-dark-gray" style={style} onClick={onClick}>
        <div className="noselect">+</div>
    </button>)
}

export const ButtonNext = ({onClick,disabled}) =>{

    return (
    <button disabled={disabled} className="button-next focus" onClick={onClick}>
        NEXT
    </button>)
}

/*USEFULL WITH H1 */
export const ButtonNextPage=({onClick,focus,disabled,children})=>{ //strzalka znika gdy jest children i jest disabled, w pozostalych przypadkach sie opacituje
    const navigate = useNavigate();
    const handleClick = ()=> {
        if(onClick) onClick();
        else navigate(1);
    }
    return (<span className={'button-page'+((!disabled &&focus) ? " color-green-highlight":"")+ (disabled&&!children?" opacity":"")}
        onClick={disabled ? undefined : handleClick}
        style={{float:"right",...(disabled?{cursor:"default"}:{})}}
    >{children}<span style={(children!=null && disabled)?{opacity:0}:undefined} className="arrow">{">"}</span></span>)
}
export const ButtonPrevPage=({disabled,onClick=null,alert=false,children})=>{ //strzalka znika gdy jest children i jest disabled, w pozostalych przypadkach sie opacituje
    const navigate = useNavigate();
    const handleClick = ()=> {
        if(!alert || window.confirm("Are you sure you want to leave?")){
            if(onClick) onClick();
            else navigate(-1)
        }  
    }
    return (<span className={'button-page'+ (disabled?" opacity":"")}
    onClick={disabled ? undefined : handleClick}
    style={disabled?{cursor:"default"}:undefined}
    ><span style={(children!=null && disabled)?{opacity:0}:undefined} className="arrow">{"<"}</span>{children}</span>)
}