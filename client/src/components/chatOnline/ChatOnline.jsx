import axios from 'axios';
import { useState, useEffect } from 'react';
import './chatOnline.css'
import noAvatar from '../../images/noAvatar.jpg'

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
    const [friends, setFriends] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([]);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    useEffect(() => {
        const getFriends = async () => {
            const res = await axios.get("/users/friends/"+currentId);
            setFriends(res.data);
        }
        getFriends();
    },[currentId]);

    useEffect(() => {
        setOnlineFriends(friends.filter(f=>onlineUsers?.includes(f._id)));
    },[friends,onlineUsers]);

    return (
        <div className="chatOnline">
            {onlineFriends.map(o => (
                <div className="chatOnlineFriend">
                <div className="chatOnlineImgContainer">
                    <img className="chatOnlineImg"
                    src={o?.profilePicture ? PF+o.profilePicture : noAvatar } 
                    alt="" />
                    <div className="chatOnlineBadge"></div>
                </div>
                <span className="chatOnlineName">John Doe</span>
                </div>
            ))}
            
        </div>
    )
}
