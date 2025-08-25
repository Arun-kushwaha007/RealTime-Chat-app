import React, { useState } from 'react';
import styled from 'styled-components';
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";

export default function ChatInput({ handleSendMsg }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emoji) => {
    let message = msg;
    message += emoji.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <form className="input-container" onSubmit={sendChat}>
        <input
          type="text"
          placeholder="Type your message here..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button className="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  background: rgba(34, 34, 50, 0.92);
  padding: 1rem 2.5rem 1.2rem 2.5rem;
  border-radius: 0 0 1.2rem 1.2rem;
  box-shadow: 0 -2px 12px #00000022;
  gap: 1.2rem;
  position: relative;
  z-index: 2;

  @media screen and (max-width: 900px) {
    padding: 0.7rem 1rem 1rem 1rem;
    border-radius: 0 0 1rem 1rem;
    gap: 0.7rem;
  }

  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.7rem;
        color: #ffe066;
        cursor: pointer;
        transition: transform 0.1s;
        &:hover {
          transform: scale(1.15);
        }
      }
      .EmojiPickerReact {
        position: absolute;
        bottom: 48px;
        left: 0;
        background-color: #232526;
        box-shadow: 0 5px 18px #9a86f3;
        border-radius: 1rem;
        border: 1.5px solid #9186f3;
        z-index: 10;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #232526;
          width: 5px;
          &-thumb {
            background-color: #9186f3;
          }
        }
        .emoji-categories button {
          filter: contrast(0.7);
        }
        .emoji-group:before {
          background-color: #232526;
        }
      }
    }
  }

  .input-container {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 1.2rem;
    border-radius: 2rem;
    background: rgba(255,255,255,0.07);
    box-shadow: 0 2px 8px 0 rgba(78,0,255,0.04);
    padding: 0.2rem 1.2rem;
    input {
      flex: 1;
      border: none;
      background: transparent;
      color: #fff;
      font-size: 1.15rem;
      padding: 0.7rem 0.5rem;
      &::placeholder {
        color: #b3b3ffbb;
        opacity: 1;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.4rem 1.4rem;
      border-radius: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(90deg, #9186f3 60%, #b3b3ff 100%);
      border: none;
      transition: background 0.2s, transform 0.1s;
      box-shadow: 0 2px 8px #4e00ff22;
      cursor: pointer;
      svg {
        font-size: 1.5rem;
        color: #232526;
      }
      &:hover {
        background: linear-gradient(90deg, #b3b3ff 60%, #9186f3 100%);
        transform: scale(1.08);
      }
    }
  }
`;