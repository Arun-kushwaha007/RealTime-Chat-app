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
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  gap: 1rem;

  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffe066;
        cursor: pointer;
        transition: all 0.3s ease;
        &:hover {
          transform: scale(1.2) rotate(10deg);
          filter: drop-shadow(0 0 5px #ffe066);
        }
      }
      .EmojiPickerReact {
        position: absolute;
        bottom: 50px;
        left: 0;
        background: rgba(30, 30, 50, 0.95) !important;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5) !important;
        border-radius: 1rem !important;
      }
    }
  }

  .input-container {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2rem;
    padding: 0.3rem 1.5rem;
    transition: all 0.3s ease;
    border: 1px solid transparent;

    &:focus-within {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(153, 122, 240, 0.5);
      box-shadow: 0 0 15px rgba(153, 122, 240, 0.1);
    }

    input {
      flex: 1;
      height: 40px;
      background: transparent;
      color: white;
      border: none;
      font-size: 1rem;
      &::placeholder {
        color: rgba(255, 255, 255, 0.4);
      }
      &:focus {
        outline: none;
      }
    }

    button {
      padding: 0.5rem 1.5rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #4e0eff 0%, #997af0 100%);
      border: none;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      
      svg {
        font-size: 1.5rem;
        color: white;
      }

      &:hover {
        transform: scale(1.05) translateX(3px);
        box-shadow: 0 5px 15px rgba(78, 14, 255, 0.4);
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }
`;