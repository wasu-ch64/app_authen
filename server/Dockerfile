# ใช้ Node.js เวอร์ชัน LTS
FROM node:22-alpine

# กำหนดโฟลเดอร์ทำงาน
WORKDIR /app

# คัดลอก dependencies
# COPY server/package.json server/package-lock.json ./
COPY package.json package-lock.json ./

# ติดตั้ง dependency
RUN npm ci

# คัดลอกซอร์สโค้ดทั้งหมด
# COPY server/ ./
COPY src/ ./src/
COPY prisma/ ./prisma/

# สร้าง Prisma Client
RUN npx prisma generate

# เปิดพอร์ต (สมมุติ API ใช้พอร์ต 5000)
EXPOSE 5000

# สลับไปใช้ user node ที่มีอยู่ใน image
USER node

# รันเซิร์ฟเวอร์ด้วยคำสั่ง dev (เช่น nodemon, ts-node)
CMD ["npm", "start"]