FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY vite.config.js ./
COPY index.html ./

RUN npm install

COPY src ./src

EXPOSE 5173

CMD ["npm", "run", "dev"]