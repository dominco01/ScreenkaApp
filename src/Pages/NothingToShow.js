import React from 'react';
import A from '../Components/A';
import { useNavigate } from 'react-router-dom';

const NothingToShow = ({goback=false}) => {
    const navigate = useNavigate();
    return ( <div >
        <div className='centered' style={{textAlign:'center',lineHeight:'0'}}>
            <div className='opacity'>Nothing to show.</div><br/>
            {goback && <A onClick={()=>navigate(-1)}>go back</A>}
        </div>
        </div> );
}
 
export default NothingToShow;