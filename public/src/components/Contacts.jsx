import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Logo from '../assets/logo.svg';

export default function Contacts({ contacts, currentUser, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    if (currentUser) {
      setCurrentUserImage(currentUser.avatarImage);
      setCurrentUserName(currentUser.username);
    }
  }, [currentUser, contacts]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserImage && currentUserName && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>ChatApp</h3>
          </div>
          <div className="contacts">
            {contacts.length === 0 ? (
              <NoContacts>
                <span>😕</span>
                <p>No contacts found.</p>
              </NoContacts>
            ) : (
              contacts.map((contact, index) => (
                <div
                  key={index}
                  className={`contact ${index === currentSelected ? 'selected' : ''}`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="avatar" />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avatar" />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 15% 70% 15%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  
  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);

    img {
      height: 2.5rem;
      filter: drop-shadow(0 0 10px rgba(78, 14, 255, 0.5));
    }
    h3 {
      text-transform: uppercase;
      color: #fff;
      font-weight: 800;
      font-size: 1.5rem;
      letter-spacing: 2px;
      margin: 0;
      background: linear-gradient(to right, #fff, #997af0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    gap: 0.8rem;
    padding: 1.5rem 0;
    
    &::-webkit-scrollbar {
      width: 4px;
      &-thumb {
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
      }
    }

    .contact {
      background: rgba(255, 255, 255, 0.05);
      width: 85%;
      display: flex;
      align-items: center;
      gap: 1rem;
      border-radius: 1rem;
      cursor: pointer;
      padding: 0.8rem 1rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(255, 255, 255, 0.05);

      .avatar {
        img {
          height: 3rem;
          border-radius: 50%;
          border: 2px solid rgba(153, 122, 240, 0.3);
          padding: 2px;
        }
      }

      .username {
        h3 {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
          transition: all 0.3s ease;
        }
      }

      &:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: scale(1.02);
        border-color: rgba(255, 255, 255, 0.1);
        .username h3 { color: #fff; }
      }

      &.selected {
        background: linear-gradient(135deg, #4e0eff 0%, #997af0 100%);
        border: none;
        box-shadow: 0 4px 15px rgba(78, 14, 255, 0.3);
        .username h3 {
          color: #fff;
          font-weight: 700;
        }
        .avatar img {
          border-color: #fff;
        }
      }
    }
  }

  .current-user {
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 1.2rem;
    justify-content: center;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding: 1rem;

    .avatar {
      img {
        height: 3.5rem;
        border-radius: 50%;
        border: 2px solid #997af0;
        padding: 2px;
      }
    }

    .username {
      h2 {
        color: #fff;
        font-size: 1.1rem;
        font-weight: 700;
        margin: 0;
      }
    }

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username h2 { font-size: 0.9rem; }
    }
  }
`;

const NoContacts = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #b3b3ff;
  opacity: 0.7;
  height: 100%;
  span {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  p {
    font-size: 1.1rem;
    margin: 0;
  }
`;