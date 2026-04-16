import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../assets/logo.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { loginRoute } from '../utils/APIRoutes';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toastOptions = {
    position: 'bottom-right',
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  };

  useEffect(() => {
    if (localStorage.getItem('chat-app-user')) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!handleValidation()) return;

    try {
      setLoading(true);
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, { username, password });

      if (data.status === false) {
        toast.error(data.msg || 'Invalid username or password', toastOptions);
      } else if (data.status === true) {
        localStorage.setItem('chat-app-user', JSON.stringify(data.user));
        navigate('/');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again later.', toastOptions);
    } finally {
      setLoading(false);
    }
  };

  const handleValidation = () => {
    const { username, password } = values;
    if (!username || !password) {
      toast.error('Username and Password are required', toastOptions);
      return false;
    }
    if (username.length < 3) {
      toast.error('Username should be at least 3 characters long', toastOptions);
      return false;
    }
    if (password.length < 6) {
      toast.error('Password should be at least 6 characters long', toastOptions);
      return false;
    }
    return true;
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>Chatapp</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
            value={values.username}
            autoComplete="username"
            required
          />
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={values.password}
              autoComplete="current-password"
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <span>
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at top right, #2a2a5d, #131324 70%);
  position: relative;
  overflow: hidden;

  &::before, &::after {
    content: "";
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4e0eff 0%, #997af0 100%);
    filter: blur(100px);
    opacity: 0.4;
    z-index: 0;
  }

  &::before {
    top: -100px;
    right: -100px;
  }

  &::after {
    bottom: -100px;
    left: -100px;
    background: linear-gradient(135deg, #ff007f 0%, #4e0eff 100%);
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1.5rem;
    padding: 3rem 4rem;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    width: 100%;
    max-width: 450px;
    z-index: 1;
    transition: transform 0.3s ease;

    .brand {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 0.5rem;
      img {
        height: 4rem;
        filter: drop-shadow(0 0 10px rgba(78, 14, 255, 0.5));
      }
      h1 {
        text-transform: uppercase;
        color: #fff;
        font-size: 2rem;
        font-weight: 800;
        letter-spacing: 2px;
        background: linear-gradient(to right, #fff, #997af0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    input {
      background: rgba(255, 255, 255, 0.1);
      padding: 1rem 1.2rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.8rem;
      color: #fff;
      font-size: 1rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      width: 100%;

      &:focus {
        border: 1px solid rgba(78, 14, 255, 0.8);
        outline: none;
        background: rgba(255, 255, 255, 0.15);
        box-shadow: 0 0 15px rgba(78, 14, 255, 0.2);
      }

      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
    }

    .password-container {
      position: relative;
      display: flex;
      align-items: center;

      input {
        width: 100%;
        padding-right: 3rem;
      }

      .password-toggle {
        position: absolute;
        right: 1rem;
        cursor: pointer;
        color: rgba(255, 255, 255, 0.6);
        font-size: 1.3rem;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .password-toggle:hover {
        color: #fff;
        transform: scale(1.1);
      }
    }

    button {
      background: linear-gradient(135deg, #4e0eff 0%, #997af0 100%);
      color: white;
      padding: 1rem;
      border: none;
      font-weight: 700;
      cursor: pointer;
      border-radius: 0.8rem;
      font-size: 1.1rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 1rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(78, 14, 255, 0.3);

      &:hover:enabled {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(78, 14, 255, 0.5);
        filter: brightness(1.1);
      }

      &:active:enabled {
        transform: translateY(-1px);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background: #444;
      }
    }

    span {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.95rem;
      text-align: center;
      margin-top: 0.5rem;
      a {
        color: #997af0;
        text-decoration: none;
        font-weight: 700;
        transition: all 0.3s ease;

        &:hover {
          color: #fff;
          text-shadow: 0 0 10px rgba(153, 122, 240, 0.8);
        }
      }
    }
  }
`;

export default Login;
