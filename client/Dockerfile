# Stage 1: Build
FROM node:12.16.3-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build-prod

# Stage 2: Run
FROM nginx:1.17.10-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/cbenabler /usr/share/nginx/html