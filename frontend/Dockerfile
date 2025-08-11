# Build stage
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy everything
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy built files to nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]