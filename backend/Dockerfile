FROM node:22-alpine

WORKDIR /app

# คัดลอกเฉพาะไฟล์ที่จำเป็นสำหรับการติดตั้ง dependencies ก่อน (เพื่อใช้ cache ได้ดี)
COPY package.json package-lock.json ./

RUN npm ci

# คัดลอกโค้ดทั้งหมด (รวม prisma schema และ tsconfig)
COPY . .

# สร้าง Prisma Client (ต้องทำหลัง copy prisma schema แล้ว)
RUN npx prisma generate

# สร้างไฟล์ JavaScript จาก TypeScript
RUN npm run build

RUN cp -r src/generated dist/generated

EXPOSE 3000

# รัน container ด้วย user ที่ปลอดภัย
USER node

CMD ["node", "start"]