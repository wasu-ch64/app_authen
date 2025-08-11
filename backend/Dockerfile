FROM node:22-alpine

WORKDIR /app

# คัดลอก package.json + package-lock.json
COPY package.json package-lock.json ./

# ติดตั้ง dependencies ทั้งหมดรวม devDependencies
RUN npm ci
# คัดลอก source code
COPY src ./src
COPY prisma ./prisma

# สร้าง Prisma Client
RUN npx prisma generate

# รัน build เพื่อ transpile TypeScript เป็น JavaScript
RUN npm run build

EXPOSE 5000

USER node

CMD ["npm", "start"]
