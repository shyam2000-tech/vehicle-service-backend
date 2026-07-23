import { Router } from "express";
import * as userController from "./user.controller.js";

const router = Router();

router.get("/all", userController.getAllUsers);
router.patch("/:id", userController.updateUser);

export default router;
