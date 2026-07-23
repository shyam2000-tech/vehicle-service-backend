# 📝 User Registration Flow

Simplified guide on how the registration system works in this project.

---

## 📂 1. Files Involved
These are the files that handle the registration process:

| File | Responsibility |
| :--- | :--- |
| `auth.route.ts` | Defines the API URL (`/register`). |
| `auth.controller.ts` | Receives the user data and handles the success/error response. |
| `auth.service.ts` | The "Brain" — manages the transaction, hashes passwords, and logic for different user types. |
| `auth.repository.ts` | The "Database Handler" — runs the SQL commands to save the data. |

---

## 🌐 2. API Details
- **Endpoint**: `POST /api/auth/register`
- **What to send**:
  ```json
  {
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "securepassword",
    "account_type": "WORKSHOP_OWNER",
    "workshop": {
      "business_name": "John's Garage",
      "contact_number": "9876543210",
      "city": "Mumbai",
      "state": "Maharashtra"
    }
  }
  ```
  *(Note: `workshop` field is only required if `account_type` is `WORKSHOP_OWNER`)*

---

## ⚡ 3. How it Works (Step-by-Step)

1. **Existence Check**: System checks if the Email or Phone is already registered.
   - *Query*: `SELECT * FROM users WHERE email = $1 OR phone = $2`
2. **Hash Password**: The password is scrambled (hashed) using `bcrypt` for safety.
3. **Transaction Start**: It opens a database "transaction" so that if one step fails, everything is undone (keeping data clean).
4. **Create User**: It saves the basic profile to the `users` table.
   - *Query*: `INSERT INTO users ... RETURNING *`
5. **Create Workshop (Optional)**: 
   - If the user is a **Workshop Owner**, it automatically saves their business details to the `workshops` table using the new User ID.
   - *Query*: `INSERT INTO workshops ...`
6. **Commit**: All changes are permanently saved to the database.

---

## 🗄️ 4. Database Info
- **Database Name**: `Repair-Booking-System`

### Main Columns Used:
- **`users` Table**: `full_name`, `email`, `phone`, `password`, `primary_role`, `account_status`.
- **`workshops` Table**: `owner_id`, `business_name`, `city`, `state`.

---

## ✅ 5. Success Response
When registration is successful, you get:
- Created User Profile (excluding password)
- Created Workshop details (if applicable)
