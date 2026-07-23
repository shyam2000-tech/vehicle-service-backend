import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { getAllWorkshopsService, updateWorkshopService } from "./workShop.service.js";
export const getAllWorkshops = asyncHandler(async (req, res) => {
    const workshops = await getAllWorkshopsService();
    res.status(200).json({
        success: true,
        message: "Workshops fetched successfully",
        data: workshops
    });
});
export const updateWorkshop = asyncHandler(async (req, res) => {
    const workshopId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const workshop = await updateWorkshopService(workshopId, req.body);
    res.status(200).json({
        success: true,
        message: "Workshop updated successfully",
        data: workshop
    });
});
