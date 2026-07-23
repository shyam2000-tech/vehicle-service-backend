# Update User API

## Endpoint

```txt
PATCH /api/users/:id
```

Example:

```txt
PATCH /api/users/5f2c3a1e-6d8b-4a7f-9f20-d3b8e1c7a4f2
```

## Input Example

Send only fields that need to be updated.

```json
{
    "name": "Aditi Sharma",
    "email": "aditi.sharma@example.com",
    "phone": "9123456780",
    "role": "customer",
    "status": "active"
}
```

Allowed fields:

```txt
name
email
phone
role
status
address
city
state
postal_code
```

## Code Flow

```txt
Route
PATCH /:id
    -> Controller
    updateUser(req, res)
        -> Service
        updateUserService(id, body)
            -> Repository
            updateUser(client, id, body)
                -> Database
                UPDATE users ...
```

## Controller

```ts
export const updateUser = asyncHandler(async (req, res) => {
    const user = await updateUserService(req.params.id, req.body);

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user
    });
});
```

`asyncHandler` catches errors automatically and sends them to `globalErrorHandler`.

## Service

Service checks:

```txt
1. User id is required.
2. Body cannot be empty.
3. Body must contain at least one allowed update field.
4. Updated user must exist.
```

Then it calls the repository.

## Repository Query

The repository creates a dynamic `SET` clause from the allowed fields.

Example body:

```json
{
    "name": "Aditi Sharma",
    "email": "aditi.sharma@example.com",
    "status": "active"
}
```

Generated query:

```sql
UPDATE users
SET name = $2,
    email = $3,
    status = $4,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;
```

Values:

```ts
[
    "5f2c3a1e-6d8b-4a7f-9f20-d3b8e1c7a4f2",
    "Aditi Sharma",
    "aditi.sharma@example.com",
    "active"
]
```

## Success Response

```json
{
    "success": true,
    "message": "User updated successfully",
    "data": {
        "id": "5f2c3a1e-6d8b-4a7f-9f20-d3b8e1c7a4f2",
        "name": "Aditi Sharma",
        "email": "aditi.sharma@example.com",
        "status": "active"
    }
}
```

## Error Messages

```txt
User id is required
At least one field is required to update user
No valid fields provided to update user
User not found
```
