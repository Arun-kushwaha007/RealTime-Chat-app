import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../assets/logo.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { registerRoute } from '../utils/APIRoutes';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      const { password, username, email } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
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
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error('Password and confirm password should match.', toastOptions);
      return false;
    } else if (username.length < 3) {
      toast.error('Username should be at least 3 characters long.', toastOptions);
      return false;
    } else if (password.length < 8) {
      toast.error('Password should be at least 8 characters long.', toastOptions);
      return false;
    } else if (!email) {
      toast.error('Email is required.', toastOptions);
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
            autoComplete="username"
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            autoComplete="email"
            required
          />

          {/* Password field */}
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              name="password"
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Confirm password field */}
          <div className="password-container">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              name="confirmPassword"
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create User'}
          </button>
          <span>
            Already have an account? <Link to="/login">Login</Link>
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
  background: linear-gradient(135deg, #131324, #1f1f3a);

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 1rem;
    padding: 3rem 4rem;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 400px;

    .brand {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1rem;
      img {
        height: 3.5rem;
      }
      h1 {
        text-transform: uppercase;
        color: #fff;
        font-size: 1.8rem;
      }
    }

    input {
      background: #1f1f3a;
      padding: 1rem;
      border: 2px solid transparent;
      border-radius: 0.5rem;
      color: #fff;
      font-size: 1rem;
      transition: border 0.3s ease, background 0.3s ease;
      width: 100%;

      &:focus {
        border: 2px solid #4e0eff;
        outline: none;
        background: #2a2a4d;
      }
    }

    .password-container {
      position: relative;
      display: flex;
      align-items: center;

      input {
        width: 100%;
        padding-right: 2.5rem;
      }

      .password-toggle {
        position: absolute;
        right: 0.8rem;
        cursor: pointer;
        color: #bbb;
        font-size: 1.2rem;
        transition: color 0.3s ease;
      }

      .password-toggle:hover {
        color: #fff;
      }
    }

    button {
      background: linear-gradient(90deg, #4e0eff, #997af0);
      color: white;
      padding: 0.9rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.5rem;
      font-size: 1rem;
      text-transform: uppercase;
      transition: transform 0.2s ease, opacity 0.3s ease;

      &:hover:enabled {
        transform: translateY(-2px);
        opacity: 0.9;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    span {
      color: white;
      font-size: 0.9rem;
      text-align: center;
      a {
        color: #997af0;
        text-decoration: none;
        font-weight: bold;
      }
    }
  }
`;

export default Register;
