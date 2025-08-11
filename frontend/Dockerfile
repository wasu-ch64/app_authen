# FROM node:22-alpine

# WORKDIR /app

# # คัดลอกไฟล์ package ก่อนเพื่อลดเวลาการ rebuild เมื่อโค้ดเปลี่ยน
# COPY package.json package-lock.json ./

# # ติดตั้ง dependencies แบบแม่นยำ
# RUN npm ci

# # คัดลอกโค้ดแอปทั้งหมด
# COPY src ./src
# COPY public ./public

# EXPOSE 5173

# # รันเป็น user ปลอดภัย
# USER root

# # รันแอปในโหมด development
# CMD ["npm", "start"]

# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY src ./src
COPY public ./public

RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
