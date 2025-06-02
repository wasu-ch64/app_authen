import { Request, Response } from "express";
import { prisma } from "../prisma";

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    let { firstName, lastName, username, email, role } = req.body;

    try {
        const userId = Number(id);

        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!existingUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

         const existingUserWithUsernameOrEmail = await prisma.user.findFirst({
            where: {
                OR: [ 
                    {username},
                    {email},
                ],
                NOT: { id: userId },
            },
        });
        if (existingUserWithUsernameOrEmail) {
            res.status(400).json({ message: 'Username or email already exists' });
            return;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                firstName,
                lastName,
                username,
                email,
                role,
                updatedAt: new Date(),
            },
        });

        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser,
        })
    } catch (error: any) {
        console.error('Update user error: ', error);
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const existingUser = await prisma.user.findUnique({
            where: { id: Number(id) },
        });

        if (!existingUser) {
            res.status(404).json({ message: 'User not found' });
        }

        await prisma.user.delete({
            where: { id: Number(id) },
        });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error: any) {
        console.error("User Delete Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}