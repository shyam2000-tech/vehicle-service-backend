import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { getAllUsersService, updateUserService } from "./user.service.js";
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await getAllUsersService();
    res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: users
    });
});
export const updateUser = asyncHandler(async (req, res) => {
    const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const user = await updateUserService(userId, req.body);
    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user
    });
});
