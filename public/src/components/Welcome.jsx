import React from 'react';
import styled from 'styled-components';
import Robot from "../assets/robot.gif";
import Logout from "./Logout";

export default function Welcome({ currentUser }) {
  return (
    <Container>
      <LogoutWrapper>
        <Logout />
      </LogoutWrapper>
      <img src={Robot} alt="robot" />
      <h1>
        Welcome, <span>{currentUser.username}!</span>
      </h1>
      <h3>Please select a chat to start messaging</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  flex-direction: column;
  color: white;
  width: 100%;
  background: transparent;
  
  img {
    height: 18rem;
    filter: drop-shadow(0 0 20px rgba(78, 14, 255, 0.4));
    margin-bottom: 1rem;
    animation: floating 3s ease-in-out infinite;
  }

  @keyframes floating {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0px); }
  }

  span {
    color: #997af0;
    font-weight: 800;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    letter-spacing: 1px;
    background: linear-gradient(to right, #fff, #997af0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  h3 {
    color: rgba(255, 255, 255, 0.6);
    font-weight: 400;
    font-size: 1.1rem;
    letter-spacing: 0.5px;
  }
`;

const LogoutWrapper = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
`;