import { Request, Response } from "express";

export const checkAuthen = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user; // ต้องมั่นใจว่า req.user ถูกขยาย type ไว้แล้ว

        res.status(200).json({
            message: "Authenticated",
            user,
        });
    } catch (error: any) {
        console.error("CheckAuth error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
