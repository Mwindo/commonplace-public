# Using a multi-stage build
FROM node:20-alpine as react_build

# set working directory
WORKDIR /src
# Copy package files first for cache reasons
COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm install
COPY ./frontend .
RUN npm run build

# Second stage: Setup Nginx to serve the static, compiled React app
FROM nginx:alpine
COPY --from=react_build /src/build /usr/share/nginx/html
# Copy Nginx configuration
COPY ./nginx/nginx_prod.conf /etc/nginx/conf.d/default.conf
