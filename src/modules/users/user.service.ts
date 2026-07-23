import { pool } from "../../config/database.js";
import { editableUserFields, userRepository } from "./user.repository.js";

export const getAllUsersService = async () => {
    const client = await pool.connect();

    try {
        return await userRepository.getAllUsers(client);
    } finally {
        client.release();
    }
};

export const updateUserService = async (id: string, payload: Record<string, any>) => {
    if (!id) {
        throw new Error("User id is required");
    }

    if (!payload || !Object.keys(payload).length) {
        throw new Error("At least one field is required to update user");
    }

    const hasEditableField = editableUserFields.some((field) => payload[field] !== undefined);

    if (!hasEditableField) {
        throw new Error("No valid fields provided to update user");
    }

    const client = await pool.connect();

    try {
        const updatedUser = await userRepository.updateUser(client, id, payload);

        if (!updatedUser) {
            throw new Error("User not found");
        }

        return updatedUser;
    } finally {
        client.release();
    }
};
