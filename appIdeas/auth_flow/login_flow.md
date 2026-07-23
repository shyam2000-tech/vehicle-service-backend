# 🔑 User Login Flow

Simplified guide on how the login system works in this project.

---

## 📂 1. Files Involved
These are the files that handle the login process:

| File | Responsibility |
| :--- | :--- |
| `auth.route.ts` | Defines the API URL (`/login`). |
| `auth.controller.ts` | Receives the request and sends back the final response. |
| `auth.service.ts` | The "Brain" — checks passwords and generates tokens. |
| `auth.repository.ts` | The "Database Handler" — runs the actual SQL queries. |
| `env.ts` | Centralized environment configuration (stores `JWT_SECRET`). |

---

## 🌐 2. API Details
- **Endpoint**: `POST /api/auth/login`
- **What to send**:
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```

---

## ⚡ 3. How it Works (Step-by-Step)

1. **Find User**: The system looks in the `users` table for the email.
   - *Query*: `SELECT * FROM users WHERE email = $1`
2. **Check Password**: It compares the typed password with the hidden (hashed) password using `bcrypt`.
3. **Verify Status**: It ensures the account is `ACTIVE`.
4. **Identify Role**: 
   - If user is a **Vehicle Owner**, it finishes here.
   - If user is a **Workshop Owner**, it goes to the `workshops` table to get their business details.
     - *Query*: `SELECT * FROM workshops WHERE owner_id = $1`
5. **Create Token**: It generates a unique **JWT Token** so the user stays logged in.

---

## 🗄️ 4. Database Info
- **Database Name**: `Repair-Booking-System`

### Main Columns Used:
- **`users` Table**: `email`, `password`, `primary_role`, `account_status`.
- **`workshops` Table**: `owner_id`, `business_name`.

---

## ✅ 5. Success Response
When login is successful, you get:
- User Profile
- Workshop Details (if they own one)
- Security Token
