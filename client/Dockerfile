FROM node:22-alpine

WORKDIR /app

# คัดลอกไฟล์ package ก่อนเพื่อลดเวลาการ rebuild เมื่อโค้ดเปลี่ยน
COPY package.json package-lock.json ./

# ติดตั้ง dependencies แบบแม่นยำ
RUN npm ci

# คัดลอกโค้ดแอปทั้งหมด
COPY src ./src
COPY public ./public

EXPOSE 5173

# รันเป็น user ปลอดภัย
USER root

# รันแอปในโหมด development
CMD ["npm", "start"]


# NGINX stage
# FROM nginx:alpine
# COPY --from=builder /app/dist /usr/share/nginx/html
# COPY nginx/nginx.conf /etc/nginx/nginx.conf
# EXPOSE 80