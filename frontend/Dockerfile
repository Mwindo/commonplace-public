# pull official base image
FROM node:20-alpine

# set working directory
WORKDIR /src

# install and cache app dependencies
COPY package.json .
COPY package-lock.json .
RUN npm ci
RUN npm install react-scripts@5.0.1 -g --silent

# start app
CMD ["npm", "start"]