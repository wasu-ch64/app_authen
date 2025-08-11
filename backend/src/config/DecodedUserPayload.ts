export interface DecodedUserPayload {
  userId: string;
  username: string;
  userEmail: string;
  userRole: string;
  iat?: number;
  exp?: number;
}
