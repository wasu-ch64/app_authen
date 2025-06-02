import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import validator from "validator";
import { prisma } from "../prisma";
import { env } from "../config/env";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        let { firstName, lastName, username, email, password, role } = req.body;
        const salt = env.BCRYPT_SALT;

        if (!firstName || !lastName || !email || !password) {
            res.status(400).json({ message: 'Please provide all required fields' });
            return;
        }

        if (!validator.isEmail(email)) {
            res.status(400).json({ message: 'Invalid email format' });
            return;
        }

        if (!username) {
            username = email.split('@')[0];
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [ 
                    {username},
                    {email}
                ],
            },
        });
        if (existingUser) {
            res.status(400).json({ message: 'Username or email already exists' });
            return;
        }

        const hashPassword = await bcrypt.hash(password, salt);
         const userRole = role === 'admin' ? 'admin' : 'user';

        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                username,
                email,
                password: hashPassword,
                role: userRole,
            },
        });

        res.status(200).json({
            message: 'Registration is successful',
            user: {
                id: newUser.id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            }
        })
    } catch (error: any) {
        console.error('Registration error: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            res.status(400).json({ message: 'Please provide username or email and password' });
            return;
        }

        const isEmail = validator.isEmail(identifier);

        const user = await prisma.user.findUnique({
           where: isEmail 
            ? { email: identifier } 
            : { username: identifier },
        });

        if (!user) {
            res.status(401).json({ message: 'Invalid username/email or password' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid username/email or password' });
            return;
        }

        const secret = env.JWT_SECRET;;
        if (!secret) {
            console.error('JWT_SECRET is not defined');           
            res.status(500).json({ message: 'Server configuration error' });
            return;
        }

        const token = jwt.sign(
            { 
                userId: user.id,
                userUsername: user.username,
                userEmail: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                userRole: user.role
            },
            secret,
            { expiresIn: '1h' }
        );

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
        });

        res.status(200).json({
            message: 'Login successful',
            user: { userId: user.id, userUsername: user.username, userEmail: user.email, role: user.role }
        })

    } catch (error: any) {
        console.error('Login error: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const logout = async (_req: Request, res: Response): Promise<void> => {
    res.clearCookie('auth_token', {
        httpOnly: true,
        sameSite: env.NODE_ENV === 'production',
        secure: env.NODE_ENV === 'production',
    });

    res.status(200).json({ message: 'Loggedout successful' });
    return;
}