import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Logout from './Logout';
import ChatInput from './ChatInput';
import axios from 'axios';
import { sendMessageRoute, getAllMessagesRoute } from '../utils/APIRoutes';

export default function ChatContainer({ currentChat, currentUser }) {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (currentUser && currentChat) {
                try {
                    const response = await axios.post(getAllMessagesRoute, {
                        from: currentUser._id,
                        to: currentChat._id,
                    });
                    setMessages(response.data);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
                console.log(getAllMessagesRoute,currentUser,currentChat);
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
                console.log('Message sent response:', response);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

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
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.fromSelf ? "sended" : "received"}`}>
                                <div className="content">
                                    <p>{message.message.text}</p>
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
    @media screen and (min-width: 720px) and (max-width: 1080px){
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
                }
            }
        }
        .username {
            h3 {
                color: white;
            }
        }
    }
    .chat-messages {
        padding: 1rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: auto;
        .message {
            display: flex;
            align-items: center;
            .content {
                padding: 1rem;
                border-radius: 1rem;
                color: #d1d1d1;
                overflow-wrap: break-word;
                font-size: 1rem;
                max-width: 40%;
                p {
                    margin: 0;
                }
            }
            .sended {
                justify-content: flex-end;
                .content {
                    background-color: #4f04ff21;
                }
            }
            .received {
                justify-content: flex-start;
                .content {
                    background-color: #9900ff20;
                }
            }
        }
    }
`;
