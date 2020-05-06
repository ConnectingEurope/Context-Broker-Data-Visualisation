FROM node:12.16.1
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
ENTRYPOINT npm run start