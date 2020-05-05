# base image
FROM node:12.16.1

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# add app
COPY . /app

# install dependencies
RUN npm install

EXPOSE 3000

# start app
CMD npm run start