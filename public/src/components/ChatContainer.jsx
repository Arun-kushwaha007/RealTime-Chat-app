import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import ChatInput from './ChatInput';
import Logout from './Logout';
import axios from 'axios';
import { sendMessageRoute, getMessagesRoute } from '../utils/APIRoutes';
import { v4 as uuidv4 } from 'uuid';



export default function ChatContainer({ currentChat, currentUser, socket }) {
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const scrollRef = useRef();

    
    useEffect(() => {
        const fetchMessages = async () => {
            if (currentChat) {
                try {
                    const response = await axios.post(getMessagesRoute, {
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
    }, [socket]);

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
    display: grid;
    grid-template-rows: 12% 76% 12%;
    gap: 0.1rem;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    
    @media screen and (min-width: 720px) and (max-width: 1080px) {
        grid-template-rows: 15% 70% 15%;
    }

    .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2rem;
        background: rgba(255, 255, 255, 0.05);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        
        .user-details {
            display: flex;
            align-items: center;
            gap: 1rem;
            .avatar {
                img {
                    height: 3rem;
                    border-radius: 50%;
                    border: 2px solid #997af0;
                    padding: 2px;
                    transition: transform 0.3s ease;
                }
                &:hover img {
                  transform: scale(1.05);
                }
            }
            .username {
                h3 {
                    color: #fff;
                    font-size: 1.1rem;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                }
            }
        }
    }

    .chat-messages {
        padding: 1.5rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
        overflow: auto;
        scroll-behavior: smooth;

        &::-webkit-scrollbar {
            width: 5px;
            &-thumb {
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                &:hover {
                  background-color: rgba(255, 255, 255, 0.2);
                }
            }
        }

        .message {
            display: flex;
            align-items: center;
            opacity: 0;
            animation: fadeIn 0.4s ease forwards;

            @keyframes fadeIn {
              to { opacity: 1; transform: translateY(0); }
              from { opacity: 0; transform: translateY(10px); }
            }

            .content {
                max-width: 50%;
                padding: 0.9rem 1.4rem;
                font-size: 1rem;
                line-height: 1.5;
                position: relative;
                
                p {
                    margin: 0;
                    word-break: break-word;
                }
            }

            &.sended {
                justify-content: flex-end;
                .content {
                    background: linear-gradient(135deg, #4e0eff 0%, #997af0 100%);
                    color: #fff;
                    border-radius: 1.2rem 1.2rem 0.2rem 1.2rem;
                    box-shadow: 0 4px 15px rgba(78, 14, 255, 0.2);
                }
            }

            &.received {
                justify-content: flex-start;
                .content {
                    background: rgba(255, 255, 255, 0.1);
                    color: #fff;
                    border-radius: 1.2rem 1.2rem 1.2rem 0.2rem;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                }
            }
        }
    }
`;