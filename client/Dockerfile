# Stage 1: Build
FROM node:12.16.1 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build-prod

# Stage 2: Run
FROM nginx:1.17.1-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/cbenabler /usr/share/nginx/html