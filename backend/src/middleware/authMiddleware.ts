/// <reference types="express" />
/// <reference path="../types/express/index.d.ts" />


import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { DecodedUserPayload } from "../config/DecodedUserPayload";


export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies.auth_token;

    if (!token) {
        res.status(401).json({ message: 'Access denied. No token provided.' });
        return;
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as DecodedUserPayload;

        req.user = decoded;
        
        next();
    } catch (error: any) {
        console.error('Token verification failed:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
    }
}