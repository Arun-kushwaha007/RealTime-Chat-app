import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import loader from "../assets/loader.gif";
import { setAvatarRoute } from '../utils/APIRoutes';

const API_BASE = 'http://localhost:5000/api/avatar';

export default function SetAvatar() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: 'bottom-right',
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  };

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
  }, []);

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
  background: linear-gradient(135deg, #232526 0%, #414345 100%);
  min-height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;

  .loader {
    max-inline-size: 100%;
    margin-top: 6rem;
  }

  .title-container {
    h1 {
      color: #b3b3ff;
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: 1px;
      margin-bottom: 0.5rem;
      text-align: center;
      text-shadow: 0 2px 8px #00000033;
    }
  }

  .avatars {
    display: flex;
    gap: 2.5rem;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;

    .avatar {
      border: 0.3rem solid transparent;
      padding: 0.4rem;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: border 0.3s, box-shadow 0.3s, transform 0.2s;
      cursor: pointer;
      background: rgba(255,255,255,0.04);

      img {
        height: 6.2rem;
        width: 6.2rem;
        border-radius: 50%;
        box-shadow: 0 4px 18px #4e00ff22;
        transition: box-shadow 0.2s;
      }

      &:hover {
        border: 0.3rem solid #b3b3ff;
        box-shadow: 0 0 0 4px #4e0eff33;
        transform: scale(1.07);
      }
    }

    .selected {
      border: 0.3rem solid #4e0eff;
      box-shadow: 0 0 0 6px #4e0eff33;
      background: rgba(78,14,255,0.08);
      img {
        box-shadow: 0 6px 24px #4e0eff55;
      }
    }
  }

  .submit-btn {
    background: linear-gradient(90deg, #9186f3 60%, #b3b3ff 100%);
    color: #232526;
    padding: 1rem 2.5rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 2rem;
    font-size: 1.08rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: background 0.3s, color 0.2s, transform 0.1s, box-shadow 0.2s;
    box-shadow: 0 2px 12px #4e00ff22;

    &:hover {
      background: linear-gradient(90deg, #b3b3ff 60%, #9186f3 100%);
      color: #4e0eff;
      transform: scale(1.05);
      box-shadow: 0 4px 18px #4e0eff33;
    }
  }
`;