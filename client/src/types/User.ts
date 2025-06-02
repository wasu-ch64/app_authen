// src/types/User.ts (หรือที่ไหนก็ได้ในโปรเจกต์ของคุณ)
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'guest';
  userRole: string
  createdAt: string;
  updatedAt: string;
  
  indentifier: string
  userEmail: string;
  userUsername: string;
}
