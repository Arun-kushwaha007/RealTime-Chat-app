import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { allUsersRoute, host } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import {io} from "socket.io-client";
function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const chat_app = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        setCurrentUser(JSON.parse(localStorage.getItem("chat-app-user")));
        setIsLoaded(true);
      }
    };
    chat_app();
  }, [navigate]);
  
  const refreshContacts = async () => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data);
      } else {
        navigate("/setAvatar");
      }
    }
  };

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);

      socket.current.on("friend-request-received", (data) => {
        // Refresh contacts (or just requests in Contacts.jsx)
        // Since Contacts.jsx manages its own request state, we might need a way to trigger it
        // Or just let Contacts.jsx handle its own socket listeners
      });
      
      socket.current.on("friend-request-accepted", (data) => {
        refreshContacts();
      });
    }
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    refreshContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <Container>
      <div className="container">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
          refreshContacts={refreshContacts}
          socket={socket}
        />
        {isLoaded && currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer
            currentChat={currentChat}
            currentUser={currentUser}
            socket={socket}
          />
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at top left, #2a2a5d, #131324 70%);
  position: relative;
  overflow: hidden;

  &::before, &::after {
    content: "";
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4e0eff 0%, #997af0 100%);
    filter: blur(120px);
    opacity: 0.35;
    z-index: 0;
  }

  &::before {
    top: -150px;
    right: -150px;
  }

  &::after {
    bottom: -150px;
    left: -150px;
    background: linear-gradient(135deg, #ff007f 0%, #4e0eff 100%);
  }

  .container {
    height: 90vh;
    width: 90vw;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 2rem;
    display: grid;
    grid-template-columns: 28% 72%;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
    z-index: 1;
    overflow: hidden;

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
      height: 95vh;
      width: 95vw;
    }
    
    @media screen and (max-width: 720px) {
      grid-template-columns: 100%;
      height: 100vh;
      width: 100vw;
      border-radius: 0;
    }
  }
`;
export default Chat;