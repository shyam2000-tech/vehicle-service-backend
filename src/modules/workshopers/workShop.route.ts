import { Router } from "express";
import * as workShopController from "./workShop.controller.js";

const router = Router();

router.get("/all", workShopController.getAllWorkshops);
router.patch("/:id", workShopController.updateWorkshop);

export default router;
