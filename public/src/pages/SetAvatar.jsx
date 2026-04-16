import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import loader from "../assets/loader.gif";
import { setAvatarRoute } from '../utils/APIRoutes';

const API_BASE = process.env.REACT_APP_API_BASE;

const toastOptions = {
  position: 'bottom-right',
  autoClose: 8000,
  pauseOnHover: true,
  draggable: true,
  theme: 'dark',
};

export default function SetAvatar() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);


  useEffect(() => {
    const local = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate('/login');
      }
    };
    local();
  }, [navigate]);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = await JSON.parse(localStorage.getItem("chat-app-user"));
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });
      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-user", JSON.stringify(user));
        navigate("/");
      } else {
        toast.error("Error setting Avatar. Please try again", toastOptions);
      }
    }
  };

  useEffect(() => {
    const fetchAvatars = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Delay
          const id = Math.round(Math.random() * 1000);
          const response = await axios.get(`${API_BASE}/${id}`);
          
          // Convert SVG string to base64
          const base64 = btoa(response.data);
          data.push(base64);
        } catch (error) {
          console.error('Error fetching avatar:', error);
          toast.error('Error fetching avatars. Please try again.', toastOptions);
          break;
        }
      }
      setAvatars(data);
      setIsLoading(false);
    };

    fetchAvatars();
  }, [navigate]);

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className='loader' />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`avatar ${selectedAvatar === index ? 'selected' : ''}`}
                onClick={() => setSelectedAvatar(index)}
              >
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt="avatar"
                />
              </div>
            ))}
          </div>
          <button className='submit-btn' onClick={setProfilePicture}>
            Set as Profile Picture
          </button>
        </Container>
      )}
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top left, #2a2a5d, #131324 70%);
  height: 100vh;
  width: 100vw;
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
    left: -150px;
  }

  &::after {
    bottom: -150px;
    right: -150px;
    background: linear-gradient(135deg, #ff007f 0%, #4e0eff 100%);
  }

  .loader {
    max-inline-size: 100%;
    z-index: 1;
  }

  .title-container {
    z-index: 1;
    h1 {
      color: #fff;
      font-size: 2.2rem;
      font-weight: 800;
      letter-spacing: 1px;
      text-align: center;
      background: linear-gradient(to right, #fff, #997af0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .avatars {
    display: flex;
    gap: 3rem;
    justify-content: center;
    align-items: center;
    z-index: 1;

    .avatar {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      padding: 0.6rem;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      cursor: pointer;
      border: 2px solid rgba(255, 255, 255, 0.1);

      img {
        height: 7rem;
        width: 7rem;
        border-radius: 50%;
        transition: all 0.3s ease;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: scale(1.1) translateY(-10px);
        border-color: #997af0;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
      }

      &.selected {
        border-color: #4e0eff;
        background: rgba(78, 14, 255, 0.1);
        box-shadow: 0 0 25px rgba(78, 14, 255, 0.4);
        transform: scale(1.1);
        img {
          transform: scale(0.95);
        }
      }
    }
  }

  .submit-btn {
    background: linear-gradient(135deg, #4e0eff 0%, #997af0 100%);
    color: white;
    padding: 1.2rem 3rem;
    border: none;
    font-weight: 800;
    cursor: pointer;
    border-radius: 1rem;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(78, 14, 255, 0.3);
    z-index: 1;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(78, 14, 255, 0.5);
      filter: brightness(1.1);
    }

    &:active {
      transform: translateY(-2px);
    }
  }
`;