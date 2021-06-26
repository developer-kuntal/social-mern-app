import './message.css'
import { format } from "timeago.js"

export default function Message({ messages, own }) {
    return (
        <div className={ own ? "message own": "message" }>
            <div className="messageTop">
                <img
                    className="messageImg"
                    src="https://st2.depositphotos.com/1104517/11965/v/600/depositphotos_119659092-stock-illustration-male-avatar-profile-picture-vector.jpg"
                    alt="" />
                <p className="messageText">
                    {messages?.text} 
                </p>
            </div>
            <div className="messageBottom">
                {format(messages?.createdAt)}
            </div>
        </div>
    )
}
