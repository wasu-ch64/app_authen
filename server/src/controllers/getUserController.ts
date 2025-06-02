import { Request, Response } from "express";
import { prisma } from "../prisma";

export const allUser = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                id: 'asc',
            }
        });

        res.status(200).json({
            message: 'Get user is success',
            users,
        })
    } catch (error: any) {
        console.error('Get user error: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const selectUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({
            message: 'Get user success',
            user,
        })
    } catch (error: any) {
        console.error('Select user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
