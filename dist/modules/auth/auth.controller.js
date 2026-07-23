import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { registerService, loginService } from "./auth.service.js";
export const login = asyncHandler(async (req, res) => {
    const result = await loginService(req.body);
    res.status(200).json({
        success: true,
        message: "Login successful",
        data: result
    });
});
export const register = asyncHandler(async (req, res) => {
    const result = await registerService(req.body);
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result
    });
});
