import React from 'react';
import styled from 'styled-components'
import Robot from "../assets/robot.gif";

export default function Welcome({currentUser}) {
  return (
    <Container>
        <img src={Robot} alt="robot" />
        <h1>
            Welcome,<span>{currentUser.usernmae}!</span>

        </h1>
        <h3>Please select a chat to Start Messaging</h3>
    </Container>
  )
}

const Container = styled.div`

`;