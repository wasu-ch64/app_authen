// types/express/index.d.ts

import { DecodedUserPayload } from "../../config/DecodedUserPayload";

declare global {
  namespace Express {
    interface Request {
      user?: DecodedUserPayload | { userRole: 'guest' }; 
    }
  }
}