import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import Logout from './Logout';
import ChatInput from './ChatInput';
import axios from 'axios';
import { sendMessageRoute, getAllMessagesRoute } from '../utils/APIRoutes';
import { v4 as uuidv4 } from 'uuid';



export default function ChatContainer({ currentChat, currentUser, socket }) {
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const scrollRef = useRef();

    
    useEffect(() => {
        const fetchMessages = async () => {
            if (currentChat) {
                try {
                    const response = await axios.post('https://real-time-chat-app-server-eight.vercel.app/api/message/getmsg', {
                        from: currentUser._id,
                        to: currentChat._id,
                    });
                    setMessages(response.data);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            }
        };
        fetchMessages();
    }, [currentChat, currentUser]);

    const handleSendMsg = async (msg) => {
        try {
            if (currentUser && currentChat) {
                const response = await axios.post(sendMessageRoute, {
                    from: currentUser._id,
                    to: currentChat._id,
                    message: msg,
                });
                socket.current.emit('send-msg', {
                    from: currentUser._id,
                    to: currentChat._id,
                    message: msg,
                });
                console.log('Message sent response:', response);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
        console.log(sendMessageRoute);
        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg });
        setMessages(msgs);
    };

    useEffect(() => {
        if (socket.current) {
            socket.current.on('msg-receive', (msg) => {
                setArrivalMessage({ fromSelf: false, message: msg });
            });
        }
    }, []);

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <>
            {currentChat && currentUser && (
                <Container>
                    <div className="chat-header">
                        <div className="user-details">
                            <div className="avatar">
                                <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="avatar" />
                            </div>
                            <div className="username">
                                <h3>{currentChat.username}</h3>
                            </div>
                        </div>
                        <Logout />
                    </div>
                    <div className="chat-messages">
                        {messages.map((message) => (
                            <div ref={scrollRef} key={uuidv4()}>
                                <div className={`message ${message.fromSelf ? 'sended' : 'received'}`}>
                                    <div className="content">
                                        <p>{message.message}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <ChatInput handleSendMsg={handleSendMsg} />
                </Container>
            )}
        </>
    );
}

const Container = styled.div`
    padding-top: 1rem;
    display: grid;
    grid-template-rows: 10% 78% 12%;
    gap: 0.1rem;
    overflow: hidden;
    background: linear-gradient(135deg, #232526 0%, #414345 100%);
    border-radius: 1.2rem;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);

    @media screen and (min-width: 720px) and (max-width: 1080px) {
        grid-auto-rows: 15% 70% 15%;
    }
    .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2rem;
        .user-details {
            display: flex;
            align-items: center;
            gap: 1rem;
            .avatar {
                img {
                    height: 3rem;
                    border-radius: 50%;
                    border: 2px solid #b3b3ff44;
                    background: #232526;
                }
            }
        }
        .username {
            h3 {
                color: #b3b3ff;
                font-size: 1.2rem;
                font-weight: 600;
                letter-spacing: 1px;
            }
        }
    }
    .chat-messages {
        padding: 1rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: auto;
        &::-webkit-scrollbar {
            width: 0.2rem;
            &-thumb {
                background-color: #ffffff39;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }
        .message {
            display: flex;
            align-items: center;
            .content {
                padding: 1rem 1.4rem;
                border-radius: 1.2rem;
                color: #d1d1d1;
                overflow-wrap: break-word;
                font-size: 1.08rem;
                max-width: 45vw;
                min-width: 2.5rem;
                box-shadow: 0 2px 12px #00000018;
                p {
                    margin: 0;
                }
            }
            &.sended {
                justify-content: flex-end;
                .content {
                    background: linear-gradient(90deg, #4f04ff21 60%, #b3b3ff33 100%);
                    color: #b3b3ff;
                    border-bottom-right-radius: 0.2rem;
                    border-top-left-radius: 1.2rem;
                }
            }
            &.received {
                justify-content: flex-start;
                .content {
                    background: linear-gradient(90deg, #9900ff20 60%, #232526 100%);
                    color: #fff;
                    border-bottom-left-radius: 0.2rem;
                    border-top-right-radius: 1.2rem;
                }
            }
        }
    }
`;