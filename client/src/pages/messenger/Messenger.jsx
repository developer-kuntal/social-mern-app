// import React from 'react'
import './messenger.css'
import Topbar from '../../components/topbar/Topbar'
import Conversation from '../../components/coversations/Conversation'
import Message from '../../components/message/Message'
import ChatOnline from '../../components/chatOnline/ChatOnline'
import { useContext, useState, useEffect, useRef } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import { io } from 'socket.io-client'


export default function Messenger() {
    
    const [conversations,setConversations] = useState([]);
    const [currentChat,setCurrentChat] = useState(null);
    const [messages,setMessages] = useState([]);
    const [newMessage,setNewMessage] = useState("");
    const [arrivalMessage,setArrivalMessage] = useState(null);
    const { user } = useContext(AuthContext);
    const scrollRef = useRef();
    const socket = useRef();

    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", data => {
            // console.log(data.senderId, data.text);
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            })
        })
    },[])

    useEffect(() => {
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && 
        setMessages(prev => [...prev,arrivalMessage]);
    },[arrivalMessage, currentChat])

    useEffect(() => {
        socket.current.emit("addUser",user._id);
        socket.current.on("getUsers", users => {
            console.log(users);
        })
    },[user]);

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get("/conversations/"+user?._id);
                setConversations(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        getConversations();
    }, [user._id])
    
    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get("/messages/"+currentChat?._id);
                setMessages(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        getMessages();
    },[currentChat]);

    // console.log(messages);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id 
        }

        const recieverId = currentChat.members.find(member => member !== user._id);
        // console.log(recieverId)
        socket.current.emit("sendMessage", {
            senderId: user._id,
            recieverId,
            text: newMessage
        })

        try {
            const res = await axios.post("/messages", message);
            setMessages([...messages, res.data]);
            setNewMessage("");
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    },[messages])

    return (
        <>
            <Topbar />
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input type="text" placeholder="Search for a friends" className="chatMenuInput" />
                        {conversations.map((c) => (
                            <div onClick={() => setCurrentChat(c)}>
                                <Conversation conversations={c} currentUser={user}/>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        { currentChat ?
                            <>
                                <div className="chatBoxTop">
                                    {
                                        messages.map(m => (
                                            <div ref={scrollRef}>
                                                <Message messages={m} own={m.sender === user._id}/>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="chatBoxBottom">
                                    <textarea 
                                        className="chatMessageInput" 
                                        placeholder="write something ..."
                                        onChange={(e)=>setNewMessage(e.target.value)}
                                        value={newMessage}
                                    ></textarea>
                                    <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
                                </div>
                            </> : <span className="noConversationText">Open a conversation to start a chat...</span>
                        }
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        <ChatOnline />
                        <ChatOnline />
                        <ChatOnline />
                    </div>
                </div>
            </div>
        </>
    )
}
