import React, { useState } from 'react';
import "./styles/InputField.css"

const InputField = (props ) => {
    const  {    autofocus,reff,placeholder,readOnly=false,
                    onEnter=()=>{},onChange=()=>{},
                    isRed,isLoading,value=undefined,
                    longer=false,file,paste=false} = props;

    const [typed,setTyped] = useState(false);

    const handleKeyDown = (event)=>{
        if(!typed) setTyped(true);
        
        if (event.key === 'Enter' && !longer) {
            reff.current.blur();
            setTyped(false)
            if(!readOnly) onEnter();
        }
    }

    const onPasteClick=()=>{
        navigator.clipboard.readText().then((clipText) => {reff.current.value = clipText;});
    }

    if(paste && navigator.clipboard)
    {
        let temp = {...props,paste:false};
        return ( 
            <div className='input-paste' >
                <InputField {...temp}/>
                <ButtonPaste disabled={isLoading} onClick={onPasteClick}/>
            </div>
        );
    }
    

    if(file)
    {
        return (<input className={((isRed && !isLoading)?"bcolor-red":"")}  
        style={{ ...(isLoading?{opacity:"0.4"}:{})}} 
        readOnly={isLoading || readOnly}   type="file" accept="image/*"  tilte="file..." onChange={onChange}/>)
    }

    if(longer)
    return (
    <textarea className={(isRed && !typed && !isLoading)?"bcolor-red":""}   
                        cols="8" rows="5" placeholder={placeholder} ref={reff} value={value}
                        readOnly={isLoading || readOnly} 
                        style={{ ...(isLoading?{opacity:"0.4"}:{})}} 
                        autoFocus={autofocus}
                        onKeyDown={handleKeyDown} onChange={onChange}
                        >
    </textarea>)

    return ( 
        <input className={(isRed && !typed && !isLoading)?"bcolor-red":""} 
        placeholder={placeholder}
        readOnly={isLoading || readOnly} 
        style={{ ...(isLoading?{opacity:"0.4"}:{})}} 
        autoFocus={autofocus} ref={reff} value={value}
        onKeyDown={handleKeyDown} onChange={onChange}
        />
    );

}
 
export default InputField;

const ButtonPaste = ({onClick,disabled}) =>{
    return (
    <button disabled={disabled} className="paste" onClick={onClick}>
        PASTE
    </button>)
}