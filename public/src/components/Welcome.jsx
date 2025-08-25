import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Robot from "../assets/robot.gif";

export default function Welcome({ currentUser }) {
  return (
    <>
      <GlobalStyle />
      <Container>
        <Card>
          <img src={Robot} alt="robot" />
          <h1>
            Welcome, <span>{currentUser.username}!</span>
          </h1>
          <h3>Please select a chat to start messaging</h3>
          <Tip>
            <span role="img" aria-label="tip">💡</span>
            Stay connected and enjoy real-time conversations!
          </Tip>
        </Card>
      </Container>
    </>
  );
}

const Container = styled.div`
  min-height: 80vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
`;

const Card = styled.div`
  background: rgba(34, 34, 50, 0.88);
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.22);
  padding: 3rem 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  max-width: 400px;
  width: 100%;
  color: #fff;
  animation: fadeIn 1s;

  img {
    height: 14rem;
    margin-bottom: 1.2rem;
    filter: drop-shadow(0 4px 24px #4e00ff33);
  }
  h1 {
    font-size: 2rem;
    font-weight: 600;
    margin: 0;
    letter-spacing: 1px;
    span {
      color: #4e00ff;
      font-weight: 700;
      margin-left: 0.3rem;
    }
  }
  h3 {
    font-size: 1.1rem;
    font-weight: 400;
    margin: 0.5rem 0 0 0;
    color: #b3b3ff;
    letter-spacing: 0.5px;
  }
`;

const Tip = styled.div`
  margin-top: 1.5rem;
  background: #282c34;
  color: #b3b3ff;
  padding: 0.8rem 1.2rem;
  border-radius: 0.8rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  box-shadow: 0 2px 8px rgba(78,0,255,0.08);
  letter-spacing: 0.2px;
`;

// import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(30px);}
    to { opacity: 1; transform: translateY(0);}
  }
`;