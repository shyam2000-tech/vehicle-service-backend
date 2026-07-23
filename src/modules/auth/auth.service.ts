import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../../config/database.js";
import { env } from "../../config/env.js";
import { authRepository } from "./auth.repository.js";

const JWT_SECRET = env.JWT_SECRET;

interface RegisterPayload {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  account_type: "WORKSHOP_OWNER" | "VEHICLE_OWNER" | "ADMIN";
  workshop?: {
    business_name: string;
    contact_number: string;
    email?: string;
    city: string;
    state: string;
  };
}

interface LoginPayload {
    email: string;
    password: string;
}

export const loginService = async (payload: LoginPayload) => {
    const { email, password } = payload;

    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    const client = await pool.connect();

    try {
        // 1. Find user by email
        const user = await authRepository.findUserByEmail(client, email);
        if (!user) {
            throw new Error("Invalid email or password");
        }

        // 2. Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }

        // 3. Check account status
        if (user.account_status !== "ACTIVE") {
            throw new Error("Account is not active. Please contact support.");
        }

        // 4. Get workshop details if the user is a workshop owner
        let workshop = null;
        if (user.primary_role === "WORKSHOP_OWNER") {
            workshop = await authRepository.findWorkshopByOwnerId(client, user.id);
        }

        // 5. Generate JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.primary_role,
                workshop_id: workshop ? workshop.id : null
            },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            workshop,
            token
        };

    } finally {
        client.release();
    }
};

export const registerService = async (payload: RegisterPayload) => {
    const { full_name, email, phone, password, account_type, workshop } = payload;
    
    if (!full_name || !email || !phone || !password || !account_type) {
        throw new Error("All required fields must be provided");
    }

    const client = await pool.connect();
    
    try {
        await client.query("BEGIN");

        // 1. Check if user already exists
        const existingUser = await authRepository.findUserExists(client, email, phone);
        if (existingUser) {
            throw new Error("User with this email or phone already exists");
        }
        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create user
        const newUser = await authRepository.createUser(client, {
            full_name,
            email,
            phone,
            password: hashedPassword,
            role: account_type === "ADMIN" ? "ADMIN" : "USER",
            primary_role: account_type,
            account_status: "ACTIVE"
        });

        let newWorkshop = null;

        // 4. Create workshop if applicable
        if (account_type === "WORKSHOP_OWNER") {
            if (!workshop) {
                throw new Error("Workshop details are required for WORKSHOP_OWNER");
            }
            newWorkshop = await authRepository.createWorkshop(client, {
                owner_id: newUser.id,
                business_name: workshop.business_name,
                contact_number: workshop.contact_number,
                email: workshop.email || email,
                city: workshop.city,
                state: workshop.state,
                account_status: "ACTIVE"
            });
        }

        await client.query("COMMIT");

        // Remove password from response
        const { password: _, ...userWithoutPassword } = newUser;

        return {
            user: userWithoutPassword,
            workshop: newWorkshop
        };

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};
