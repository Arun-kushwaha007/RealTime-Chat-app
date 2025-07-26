# Real-Time Chat Application

This is a full-stack real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO. It allows users to register, log in, choose an avatar, and chat with other registered users in real-time.

## Features

-   **User Authentication:** Secure user registration and login with password hashing.
-   **Real-Time Messaging:** Instant messaging between users using Socket.IO.
-   **Contact List:** View a list of all registered users to start a conversation.
-   **Avatar Selection:** Users can choose a custom avatar after registering.
-   **Welcome Page:** A personalized welcome message is displayed to logged-in users.

## Technologies Used

### Frontend

-   **React:** A JavaScript library for building user interfaces.
-   **Styled-Components:** For styling React components.
-   **React Router:** For handling routing within the application.
-   **Axios:** For making HTTP requests to the backend API.
-   **Socket.IO Client:** For real-time communication with the server.

### Backend

-   **Node.js:** A JavaScript runtime environment.
-   **Express:** A web application framework for Node.js.
-   **MongoDB:** A NoSQL database for storing user and message data.
-   **Mongoose:** An ODM (Object Data Modeling) library for MongoDB and Node.js.
-   **Socket.IO:** For enabling real-time, bidirectional communication.
-   **Bcrypt:** For hashing passwords before storing them in the database.
-   **CORS:** To enable Cross-Origin Resource Sharing.
-   **Dotenv:** To manage environment variables.

## Project Structure

The project is divided into two main directories:

-   `public`: Contains the React frontend application.
-   `server`: Contains the Node.js/Express backend server.

### `public` Directory

```
public
├── public
│   ├── ... (public assets)
├── src
│   ├── assets
│   │   ├── ... (images, gifs)
│   ├── components
│   │   ├── ChatContainer.jsx
│   │   ├── ChatInput.jsx
│   │   ├── Contacts.jsx
│   │   ├── Logout.jsx
│   │   ├── Messages.jsx
│   │   └── Welcome.jsx
│   ├── pages
│   │   ├── Chat.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── SetAvatar.jsx
│   ├── utils
│   │   └── APIRoutes.js
│   ├── App.js
│   ├── index.css
│   └── index.js
├── .gitignore
├── package.json
└── README.md
```

### `server` Directory

```
server
├── controllers
│   ├── messagesController.js
│   └── usersController.js
├── model
│   ├── messageModel.js
│   └── userModel.js
├── routes
│   ├── messagesRoute.js
│   └── userRoutes.js
├── .env
├── index.js
└── package.json
```

## Setup and Installation

To run this project locally, you will need to have Node.js and MongoDB installed.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/real-time-chat-app.git
    cd real-time-chat-app
    ```

2.  **Install backend dependencies:**

    ```bash
    cd server
    npm install
    ```

3.  **Install frontend dependencies:**

    ```bash
    cd ../public
    npm install
    ```

4.  **Set up environment variables:**

    Create a `.env` file in the `server` directory and add the following:

    ```
    MONGO_URL=your_mongodb_connection_string
    PORT=5000
    ```

5.  **Run the backend server:**

    ```bash
    cd ../server
    npm start
    ```

6.  **Run the frontend application:**

    ```bash
    cd ../public
    npm start
    ```

The application should now be running at `http://localhost:3000`.
