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
RUN npm install -g @angular/cli@7.3.9

# start app
ENTRYPOINT ["ng", "serve", "--proxy-config", "proxy-docker.conf.json", "--port", "4200"]
CMD ["--host", "0.0.0.0"]