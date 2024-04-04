# 1. For build React app
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app
COPY package*.json /.

# npm install
RUN npm install --legacy-peer-deps
COPY . .

# build
RUN npm run build

# 2. For Nginx setup
FROM nginx:stable-alpine as production-stage

# Copy config nginx
COPY --from=build /app/.nginx/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets from builder stage
COPY --from=build /app/dist .

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
