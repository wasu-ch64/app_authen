# ใช้ node image สำหรับ build
FROM node:22-alpine as build

WORKDIR /app

# copy package.json & package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# copy source code
COPY . .

# build project
RUN npm run build

# ใช้ nginx serve static files
FROM nginx:alpine

# copy build output (Vite => dist) to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# copy custom nginx config
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# COPY docker-entrypoint.sh /docker-entrypoint.sh
# RUN chmod +x /docker-entrypoint.sh

# expose port 80
EXPOSE 80
# ENTRYPOINT ["/docker-entrypoint.sh"]
# start nginx
CMD ["nginx", "-g", "daemon off;"]
