import "./UploadButton.css"

const UploadButton = (
    {
        onClick,disabled,
        tickets,noTicketAnimation=false,
        options:{lock,orange,hashtag}
    }) =>{
    let text = hashtag ? "UPLO#D":"UPLOAD";

    return (<UploadButtonBasic 
        text={text} className={orange?"bcolor-orange":undefined} style={lock?{color:"#050509"}:undefined}
        onClick={onClick} disabled={disabled}
        tickets={tickets} noTicketAnimation={noTicketAnimation}
        />)
}
 
export default UploadButton;

const UploadButtonBasic = (
    {
        text="UPLOAD",className="",style,
        onClick,disabled,
        tickets,noTicketAnimation=false,
    }) =>{
    return (
    <button disabled={disabled} className={"upload "+className+(!disabled?" focus":(noTicketAnimation ? " focus opacity ":" bcolor-gray"))} style={style} onClick={onClick}>
        {noTicketAnimation &&  (text)}
        {!noTicketAnimation && !disabled && (tickets>0 ?  text :`${text}*`)}
        {!noTicketAnimation && disabled &&  <h5><span role="img" aria-label="ticket" >🎟️</span>x{tickets}</h5>} 
    </button>)
}