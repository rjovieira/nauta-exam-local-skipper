# Stage 1: Build the Expo Web App
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application files
COPY . .

# Export the application for Web production
RUN npx expo export --platform web

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy static assets from build phase into the 'nauta' subdirectory
COPY --from=builder /app/dist /usr/share/nginx/html/nauta

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

