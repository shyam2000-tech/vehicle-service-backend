import { PoolClient } from "pg";

export const editableWorkshopFields = [
    "business_name",
    "contact_number",
    "email",
    "city",
    "state",
    "account_status",
    "is_available",
    "subscription_id"
];

export const workShopRepository = {
    // Get all active and available workshops
    getAllWorkshops: async (client: PoolClient) => {
        const query = `
            SELECT
                id,
                owner_id,
                business_name,
                contact_number,
                email,
                city,
                state,
                rating,
                total_bookings,
                total_earnings,
                account_status,
                is_available,
                subscription_id,
                created_at,
                updated_at
            FROM workshops
            WHERE account_status = 'ACTIVE'
              AND is_available = true
            ORDER BY created_at DESC
        `;
        const result = await client.query(query);
        return result.rows;
    },

    // Update workshop by id
    updateWorkshop: async (client: PoolClient, id: string, data: Record<string, any>) => {
        const fields = editableWorkshopFields.filter((field) => data[field] !== undefined);

        const setClause = fields
            .map((field, index) => `${field} = $${index + 2}`)
            .join(", ");
        const values = fields.map((field) => data[field]);

        const query = `
            UPDATE workshops
            SET ${setClause},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING
                id,
                owner_id,
                business_name,
                contact_number,
                email,
                city,
                state,
                rating,
                total_bookings,
                total_earnings,
                account_status,
                is_available,
                subscription_id,
                created_at,
                updated_at
        `;

        const result = await client.query(query, [id, ...values]);
        return result.rows[0];
    }
};
