# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

COPY server/package*.json ./

RUN npm install

COPY server/ .

COPY public/package*.json ./public/

RUN npm install --prefix public

# Copy the frontend's source code
COPY public/ ./public/

RUN npm run build --prefix public

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
