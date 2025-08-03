# Use a Node.js base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to the working directory
# This step is cached, so it's efficient if dependencies don't change
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy your scripts first and make them executable
# This ensures that the permissions are set correctly before the rest of the code is copied
COPY start.sh ./
COPY init-db.sh ./
RUN chmod +x ./start.sh ./init-db.sh

# Copy the rest of your application code
# This copies everything else, including your backend source and the db directory
COPY . .

# Recommended security practice: switch to a non-root user
USER node

# Expose the port your application runs on
EXPOSE 3000

# Command to run the application when the container starts
# The start.sh script will be executed with the correct permissions
CMD ["./start.sh"]
