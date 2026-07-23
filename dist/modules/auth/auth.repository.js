export const authRepository = {
    // Find is user exists by email or phone
    findUserExists: async (client, email, phone) => {
        const query = `SELECT * FROM users WHERE email = $1 OR phone = $2 LIMIT 1`;
        const result = await client.query(query, [email, phone]);
        return result.rows[0];
    },
    // Create user
    createUser: async (client, data) => {
        const query = `INSERT INTO users (full_name, email, phone, password, role, primary_role, account_status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
        const values = [data.full_name, data.email, data.phone, data.password, data.role || 'USER', data.primary_role, data.account_status];
        const result = await client.query(query, values);
        return result.rows[0];
    },
    // Create workshop
    createWorkshop: async (client, data) => {
        const query = `INSERT INTO workshops (owner_id, business_name, contact_number, email, city, state, account_status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
        const values = [data.owner_id, data.business_name, data.contact_number, data.email, data.city, data.state, data.account_status];
        const result = await client.query(query, values);
        return result.rows[0];
    },
    // Find user by email
    findUserByEmail: async (client, email) => {
        const query = `SELECT * FROM users WHERE email = $1 LIMIT 1`;
        const result = await client.query(query, [email]);
        return result.rows[0];
    },
    // Find workshop by owner id
    findWorkshopByOwnerId: async (client, ownerId) => {
        const query = `SELECT * FROM workshops WHERE owner_id = $1 LIMIT 1`;
        const result = await client.query(query, [ownerId]);
        return result.rows[0];
    }
};
