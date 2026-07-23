# Update Workshop API

## Endpoint

```txt
PATCH /api/workshops/:id
```

Example:

```txt
PATCH /api/workshops/4e7c7a9b-8d8c-4f61-9e2f-2c1f2d7c9a11
```

## Input Example

Send only fields that need to be updated.

```json
{
    "business_name": "SpeedFix Auto Care",
    "contact_number": "9876543210",
    "email": "speedfix@example.com",
    "city": "Pune",
    "state": "Maharashtra",
    "is_available": true
}
```

Allowed fields:

```txt
business_name
contact_number
email
city
state
account_status
is_available
subscription_id
```

## Code Flow

```txt
Route
PATCH /:id
    -> Controller
    updateWorkshop(req, res)
        -> Service
        updateWorkshopService(id, body)
            -> Repository
            updateWorkshop(client, id, body)
                -> Database
                UPDATE workshops ...
```

## Controller

```ts
export const updateWorkshop = asyncHandler(async (req, res) => {
    const workshop = await updateWorkshopService(req.params.id, req.body);

    res.status(200).json({
        success: true,
        message: "Workshop updated successfully",
        data: workshop
    });
});
```

`asyncHandler` catches errors automatically and sends them to `globalErrorHandler`.

## Service

Service checks:

```txt
1. Workshop id is required.
2. Body cannot be empty.
3. Body must contain at least one allowed update field.
4. Updated workshop must exist.
```

Then it calls the repository.

## Repository Query

The repository creates a dynamic `SET` clause from the allowed fields.

Example body:

```json
{
    "business_name": "SpeedFix Auto Care",
    "city": "Pune",
    "is_available": true
}
```

Generated query:

```sql
UPDATE workshops
SET business_name = $2,
    city = $3,
    is_available = $4,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;
```

Values:

```ts
[
    "4e7c7a9b-8d8c-4f61-9e2f-2c1f2d7c9a11",
    "SpeedFix Auto Care",
    "Pune",
    true
]
```

## Success Response

```json
{
    "success": true,
    "message": "Workshop updated successfully",
    "data": {
        "id": "4e7c7a9b-8d8c-4f61-9e2f-2c1f2d7c9a11",
        "business_name": "SpeedFix Auto Care",
        "city": "Pune",
        "is_available": true
    }
}
```

## Error Messages

```txt
Workshop id is required
At least one field is required to update workshop
No valid fields provided to update workshop
Workshop not found
```
