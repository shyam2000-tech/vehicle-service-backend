import { Router } from "express";
import authRouter from "../modules/auth/auth.route.js";
import workShopRouter from "../modules/workshopers/workShop.route.js";
import userRouter from "../modules/users/user.route.js";
const router = Router();
router.use("/auth", authRouter);
router.use("/workshops", workShopRouter);
router.use("/users", userRouter);
export default router;
