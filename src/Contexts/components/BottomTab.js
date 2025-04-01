import React from 'react';
import { ButtonClose } from '../../Components/Buttons';
import "./BottomTab.css"

const BottomTab = ({title,subtitle,image,children,footer,onClose,footerCenter, maxHeight}) => {
    return ( 
    <div className="bottom-tab bcolor-dark-gray-solid" style={maxHeight?{height:"calc(100% + (-100px))",minHeight:"400px", }:{minHeight:"350px"}}>
        <div className='head'>
            {image &&  <img src={image} alt="main" style={{marginBottom:"5px"}}/>}
                <h3 style={image?{marginBottom:"5px"}:{}} className="color-white">{title}{image?<br/>:""}
                    <span style={image?{marginTop:"0"}:{}} className={image?"subtitle":'subtitle opacity'} > {subtitle}</span>
                </h3>
        </div>

        
        {children && <div className='bottom-tab-content'>
            {children}
        </div>}

        {footer && <footer className='light'>
            {footer}
        </footer>}

        {footerCenter && <footer className='light center'>
            {footerCenter}
        </footer>}
        
        <div className="bottom-tab-close">
            <ButtonClose onClick={onClose} />
        </div>
        
    </div> );
}

export default BottomTab;