import { pool } from "../../config/database.js";
import { editableWorkshopFields, workShopRepository } from "./workShop.repository.js";

export const getAllWorkshopsService = async () => {
    const client = await pool.connect();

    try {
        return await workShopRepository.getAllWorkshops(client);
    } finally {
        client.release();
    }
};

export const updateWorkshopService = async (id: string, payload: Record<string, any>) => {
    if (!id) {
        throw new Error("Workshop id is required");
    }

    if (!payload || !Object.keys(payload).length) {
        throw new Error("At least one field is required to update workshop");
    }

    const hasEditableField = editableWorkshopFields.some((field) => payload[field] !== undefined);

    if (!hasEditableField) {
        throw new Error("No valid fields provided to update workshop");
    }

    const client = await pool.connect();

    try {
        const updatedWorkshop = await workShopRepository.updateWorkshop(client, id, payload);

        if (!updatedWorkshop) {
            throw new Error("Workshop not found");
        }

        return updatedWorkshop;
    } finally {
        client.release();
    }
};
