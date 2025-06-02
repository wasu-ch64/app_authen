
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { DecodedUserPayload } from "../config/DecodedUserPayload";

export const authenticateOptional = (req: Request, _res: Response, next: NextFunction): void => {
    const token = req.cookies.auth_token;

    if (!token) {
        req.user = { userRole: 'guest' };
        return next();
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as DecodedUserPayload;
        req.user = decoded;
        next();
    } catch (error: any) {
        req.user = { userRole: 'guest' }
        return next();
    }
}