import React from 'react';
import "./styles/Checkbox.css"

const Checkbox = ({defaultChecked,checked,disabled,onChange,name="",
    mini,children,hide}) => {
    
    disabled = disabled || !onChange;

    if(children) return(
        <span style={{display:"flex",marginTop:"-5px" ,opacity:(hide?"0":(checked?"0.8":"0.6"))}}>
            <Checkbox defaultChecked={defaultChecked} checked={checked} disabled={disabled} onChange={onChange} name={name} mini={mini}/>
            <span className={disabled?" opacity":""} style={{margin:"0 0 0 5px", fontSize:(mini?"15px" :"20px")}}>{children}</span>
        </span>
    )

    return (  
        <label className={"container"+(mini?" mini":"")}>
            <input 
                type="checkbox" 
                name ={name}
                defaultChecked={defaultChecked}
                checked={checked}
                disabled={disabled}
                onChange={onChange} //e: {name, checked}
            />
            <span className={"checkmark"+(mini?" mini":"")}></span>
        </label>
    );
}
 
export default Checkbox;