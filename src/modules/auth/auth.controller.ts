import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { registerService, loginService } from "./auth.service.js";

export const login = asyncHandler(async (req: Request, res: Response) => {
    const result = await loginService(req.body);

    res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: "/",
    });

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: result
    });
});

export const register = asyncHandler(async (req: Request, res: Response) => {
    const result = await registerService(req.body);

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result
    });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
    });

    res.status(200).json({
        success: true,
        message: "Logout successful",
    });
});
