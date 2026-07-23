import { PoolClient } from "pg";

export const editableUserFields = [
    "full_name",
    "email",
    "phone",
    "primary_role",
    "account_status",
    "avatar_url",
    "total_spent"
];

const userSelectColumns = `
    id,
    full_name,
    email,
    phone,
    role,
    primary_role,
    account_status,
    avatar_url,
    last_login,
    total_spent,
    created_at,
    updated_at,
    deleted_at
`;

export const userRepository = {
    // Get all users except password
    getAllUsers: async (client: PoolClient) => {
        const query = `
            SELECT
                ${userSelectColumns}
            FROM users
            WHERE deleted_at IS NULL
            ORDER BY created_at DESC
        `;

        const result = await client.query(query);
        return result.rows;
    },

    // Update user by id
    updateUser: async (client: PoolClient, id: string, data: Record<string, any>) => {
        const fields = editableUserFields.filter((field) => data[field] !== undefined);
        const setClause = fields
            .map((field, index) => `${field} = $${index + 2}`)
            .join(", ");
        const values = fields.map((field) => data[field]);

        const query = `
            UPDATE users
            SET ${setClause},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
              AND deleted_at IS NULL
            RETURNING
                ${userSelectColumns}
        `;

        const result = await client.query(query, [id, ...values]);
        return result.rows[0];
    }
};
