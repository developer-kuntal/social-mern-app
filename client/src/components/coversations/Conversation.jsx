import axios from 'axios';
import { useState, useEffect } from 'react'
import './conversation.css'

export default function Conversation({conversations, currentUser}) {
    const [user, setUser] = useState(null);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    useEffect(() => {
        const friendId = conversations?.members.find(m=> m !== currentUser._id)
        console.log("Friend"+friendId);
        const getUser = async () => {
            try {
                const res =  await axios("/users?userId=" + friendId);
                setUser(res.data);
            } catch (err) {
                console.log(err);
            }
            // const res = await axios("/users?userId="+friendId);
        }
        getUser();
    },[currentUser, conversations]);

    // console.log("Users: "+ JSON.stringify(user));

    return (
        <div className="conversation">
            <img className="conversationImg" 
            src={user?.profilePicture ? user?.profilePicture : PF+"person/noAvatar.png"}
            alt=""/>
            <span className="conversationName">{user?.username}</span>
        </div>
    )
}
