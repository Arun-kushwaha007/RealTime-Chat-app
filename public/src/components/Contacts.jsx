import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import axios from "axios";
import {
  searchUsersRoute,
  sendFriendRequestRoute,
  getFriendRequestsRoute,
  respondFriendRequestRoute,
} from "../utils/APIRoutes";
import {
  IoSearchOutline,
  IoPeopleOutline,
  IoPersonAddOutline,
  IoMailOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logout from "./Logout";

const toastOptions = {
  position: "bottom-right",
  autoClose: 8000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};


export default function Contacts({
  contacts,
  currentUser,
  changeChat,
  refreshContacts,
  socket,
}) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [view, setView] = useState("contacts"); // contacts, requests, search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [requestedUsers, setRequestedUsers] = useState({});

  useEffect(() => {
    if (currentUser) {
      setCurrentUserImage(currentUser.avatarImage);
      setCurrentUserName(currentUser.username);
      fetchRequests();
    }
  }, [currentUser]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("friend-request-received", (data) => {
        fetchRequests();
      });
      socket.current.on("friend-request-accepted", (data) => {
        refreshContacts();
      });
    }
  }, [socket]);

  const fetchRequests = async () => {
    if (currentUser) {
      const { data } = await axios.get(`${getFriendRequestsRoute}/${currentUser._id}`);
      setPendingRequests(data);
    }
  };


  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      setView("search");
      const { data } = await axios.get(
        `${searchUsersRoute}/${query}?currentUserId=${currentUser._id}`
      );
      setSearchResults(data);
    } else if (query.length === 0) {
      setView("contacts");
    }
  };

  const sendRequest = async (to) => {
    const { data } = await axios.post(sendFriendRequestRoute, {
      from: currentUser._id,
      to,
    });
    if (data.status) {
      socket.current.emit("send-friend-request", {
        from: currentUser._id,
        to,
        username: currentUser.username,
      });
      setRequestedUsers((prev) => ({ ...prev, [to]: true }));
      toast.success("Friend request sent!", toastOptions);
    } else {
      toast.error(data.msg, toastOptions);
    }
  };

  const respondRequest = async (requestId, response) => {
    const { data } = await axios.post(respondFriendRequestRoute, {
      requestId,
      response,
    });
    if (data.status) {
      if (response === "accepted") {
        const request = pendingRequests.find((r) => r._id === requestId);
        socket.current.emit("accept-friend-request", {
          from: currentUser._id,
          to: request.sender._id,
          username: currentUser.username,
        });
        refreshContacts();
        toast.success("New friend added!", toastOptions);
      }
      fetchRequests();
    }
  };


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

          <div className="search-container">
            <div className="search-bar">
              <IoSearchOutline />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="view-selector">
            <button
              className={view === "contacts" ? "active" : ""}
              onClick={() => setView("contacts")}
            >
              <IoPeopleOutline />
              <span>Friends</span>
            </button>
            <button
              className={view === "requests" ? "active" : ""}
              onClick={() => setView("requests")}
            >
              <IoMailOutline />
              {pendingRequests.length > 0 && (
                <span className="badge">{pendingRequests.length}</span>
              )}
              <span>Requests</span>
            </button>
          </div>

          <div className="list-container">
            {view === "contacts" && (
              <div className="contacts">
                {contacts.length === 0 ? (
                  <NoContacts>
                    <span>😕</span>
                    <p>No friends yet. Search and add some!</p>
                  </NoContacts>
                ) : (
                  contacts.map((contact, index) => (
                    <div
                      key={contact._id}
                      className={`contact ${index === currentSelected ? "selected" : ""}`}
                      onClick={() => changeCurrentChat(index, contact)}
                    >
                      <div className="avatar">
                        <img
                          src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                          alt="avatar"
                        />
                      </div>
                      <div className="username">
                        <h3>{contact.username}</h3>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {view === "search" && (
              <div className="contacts">
                {searchResults.length === 0 ? (
                  <NoContacts>
                    <p>No users found.</p>
                  </NoContacts>
                ) : (
                  searchResults.map((user) => (
                    <div key={user._id} className="contact search-result">
                      <div className="avatar">
                        <img
                          src={`data:image/svg+xml;base64,${user.avatarImage}`}
                          alt="avatar"
                        />
                      </div>
                      <div className="username">
                        <h3>{user.username}</h3>
                      </div>
                      <button
                        className={`add-btn ${requestedUsers[user._id] ? "disabled" : ""}`}
                        onClick={() => !requestedUsers[user._id] && sendRequest(user._id)}
                        disabled={requestedUsers[user._id]}
                      >
                        {requestedUsers[user._id] ? (
                          <IoCheckmarkCircleOutline title="Request Sent" />
                        ) : (
                          <IoPersonAddOutline title="Send Friend Request" />
                        )}
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {view === "requests" && (
              <div className="contacts">
                {pendingRequests.length === 0 ? (
                  <NoContacts>
                    <p>No pending requests.</p>
                  </NoContacts>
                ) : (
                  pendingRequests.map((request) => (
                    <div key={request._id} className="contact request-item">
                      <div className="avatar">
                        <img
                          src={`data:image/svg+xml;base64,${request.sender.avatarImage}`}
                          alt="avatar"
                        />
                      </div>
                      <div className="username">
                        <h3>{request.sender.username}</h3>
                      </div>
                      <div className="actions">
                        <button
                          className="accept"
                          onClick={() => respondRequest(request._id, "accepted")}
                        >
                          <IoCheckmarkCircleOutline />
                        </button>
                        <button
                          className="reject"
                          onClick={() => respondRequest(request._id, "rejected")}
                        >
                          <IoCloseCircleOutline />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="current-user">
            <div className="avatar">
              <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avatar" />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
            <Logout />
          </div>
          <ToastContainer />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 10% 8% 62% 10%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);

  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 0.5rem;
    img {
      height: 2rem;
      filter: drop-shadow(0 0 10px rgba(78, 14, 255, 0.5));
    }
    h3 {
      text-transform: uppercase;
      color: #fff;
      font-weight: 800;
      font-size: 1.2rem;
      letter-spacing: 2px;
      margin: 0;
      background: linear-gradient(to right, #fff, #997af0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .search-container {
    padding: 0 1rem;
    display: flex;
    align-items: center;
    .search-bar {
      width: 100%;
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 0.8rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      svg {
        color: #997af0;
      }
      input {
        background: transparent;
        border: none;
        color: white;
        width: 100%;
        &:focus {
          outline: none;
        }
        &::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
      }
    }
  }

  .view-selector {
    display: flex;
    justify-content: space-around;
    padding: 0.2rem 1rem;
    gap: 0.5rem;
    button {
      flex: 1;
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.3rem;
      font-size: 0.9rem;
      padding: 0.3rem;
      border-radius: 0.5rem;
      transition: all 0.3s ease;
      position: relative;
      svg {
        font-size: 1.1rem;
      }
      &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.05);
      }
      &.active {
        color: #fff;
        background: rgba(153, 122, 240, 0.2);
        font-weight: 700;
      }
      .badge {
        position: absolute;
        top: -2px;
        right: 5px;
        background: #ff4d4d;
        color: white;
        font-size: 0.7rem;
        padding: 1px 5px;
        border-radius: 10px;
        font-weight: bold;
      }
    }
  }

  .list-container {
    overflow-y: auto;
    padding: 0.5rem 0;
    &::-webkit-scrollbar {
      width: 4px;
      &-thumb {
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
      }
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;

    .contact {
      background: rgba(255, 255, 255, 0.03);
      width: 90%;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      border-radius: 0.8rem;
      cursor: pointer;
      padding: 0.6rem 0.8rem;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.02);

      &.search-result,
      &.request-item {
        cursor: default;
      }

      .avatar {
        img {
          height: 2.5rem;
          border-radius: 50%;
          border: 2px solid rgba(153, 122, 240, 0.3);
          padding: 2px;
        }
      }

      .username {
        flex: 1;
        h3 {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          font-weight: 500;
          margin: 0;
        }
      }

      .add-btn,
      .actions button {
        background: transparent;
        border: none;
        color: #997af0;
        cursor: pointer;
        font-size: 1.3rem;
        display: flex;
        align-items: center;
        transition: all 0.3s ease;
        &:hover {
          transform: scale(1.2);
          color: #fff;
        }
        &.disabled {
          color: #4caf50;
          cursor: default;
          pointer-events: none;
        }
      }

      .actions {
        display: flex;
        gap: 0.5rem;
        .accept {
          color: #4caf50;
        }
        .reject {
          color: #f44336;
        }
      }

      &:hover:not(.search-result):not(.request-item) {
        background: rgba(255, 255, 255, 0.1);
      }

      &.selected {
        background: linear-gradient(135deg, #4e0eff 0%, #997af0 100%);
        border: none;
        .username h3 {
          color: #fff;
          font-weight: 700;
        }
        .avatar img {
          border-color: #fff;
        }
      }
    }
  }

  .current-user {
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: space-between;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding: 0.5rem 1rem;

    .avatar {
      img {
        height: 2.5rem;
        border-radius: 50%;
        border: 2px solid #997af0;
        padding: 2px;
      }
    }

    .username {
      flex: 1;
      h2 {
        color: #fff;
        font-size: 0.9rem;
        font-weight: 700;
        margin: 0;
      }
    }
  }
`;

const NoContacts = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  height: 100%;
  padding-top: 2rem;
  span {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  p {
    font-size: 0.8rem;
    margin: 0;
    text-align: center;
  }
`;