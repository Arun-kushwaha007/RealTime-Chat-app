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
  grid-template-rows: 12% 73% 15%;
  overflow: hidden;
  background: linear-gradient(135deg, #232526 0%, #414345 100%);
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  position: relative;
  min-height: 100%;
  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding-top: 1.2rem;
    img {
      height: 2.5rem;
      filter: drop-shadow(0 2px 8px #4e00ff33);
    }
    h3 {
      text-transform: uppercase;
      color: #b3b3ff;
      letter-spacing: 2px;
      font-weight: 700;
      font-size: 1.5rem;
      text-shadow: 0 2px 8px #00000033;
      margin: 0;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    gap: 1.1rem;
    padding: 0.7rem 0 0.7rem 0;
    &::-webkit-scrollbar{
      width: 0.2rem;
      &-thumb{
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background: rgba(255,255,255,0.10);
      min-height: 4.5rem;
      width: 94%;
      display: flex;
      align-items: center;
      gap: 1.1rem;
      border-radius: 0.9rem;
      cursor: pointer;
      transition: background 0.3s, transform 0.2s, box-shadow 0.2s;
      padding: 0.6rem 1.2rem;
      border: 2px solid transparent;
      box-shadow: 0 2px 8px 0 rgba(78,0,255,0.04);
      .avatar {
        img {
          height: 3.2rem;
          border-radius: 50%;
          border: 2px solid #b3b3ff33;
          background: #232526;
          box-shadow: 0 2px 8px #4e00ff22;
        }
      }
      .username {
        h3 {
          color: #fff;
          font-size: 1.13rem;
          font-weight: 500;
          letter-spacing: 1px;
          margin: 0;
        }
      }
      &:hover {
        background: #282c34;
        transform: scale(1.04);
        box-shadow: 0 4px 16px 0 #4e00ff22;
      }
    }
    .selected {
      background: linear-gradient(90deg, #9186f3 60%, #b3b3ff 100%);
      border: 2px solid #b3b3ff;
      box-shadow: 0 4px 16px 0 #4e00ff33;
      .username h3 {
        color: #232526;
        font-weight: 700;
      }
    }
  }
  .current-user {
    background: rgba(13,13,48,0.97);
    display: flex;
    align-items: center;
    gap: 1.2rem;
    justify-content: center;
    border-radius: 0 0 1.2rem 1.2rem;
    box-shadow: 0 -2px 12px #00000022;
    padding: 1.1rem 0 0.7rem 0;
    .avatar {
      img {
        height: 3.6rem;
        max-inline-size: 100%;
        border-radius: 50%;
        border: 2px solid #b3b3ff44;
        background: #232526;
        box-shadow: 0 2px 8px #4e00ff22;
      }
    }
    .username {
      h2 {
        color: #b3b3ff;
        font-size: 1.22rem;
        font-weight: 600;
        letter-spacing: 1px;
        margin: 0;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.7rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
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