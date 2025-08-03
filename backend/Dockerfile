FROM node:18-alpine

# Install PostgreSQL client tools and bash for better shell script support
RUN apk add --no-cache postgresql-client bash

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy initialization scripts first to ensure they're properly set up
COPY init-db.sh /app/
COPY start.sh /app/
COPY db/ /app/db/

# Make the initialization scripts executable
RUN chmod +x /app/init-db.sh
RUN chmod +x /app/start.sh

# Copy the rest of the application
COPY . .

EXPOSE 3000

# Use bash to run the start script for better error handling
CMD ["/bin/bash", "/app/start.sh"]