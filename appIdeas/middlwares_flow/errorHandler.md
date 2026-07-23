# Middleware: asyncHandler and Global Error Handler

## Why We Need This

Normally, every async API controller needs a `try/catch` block:

```ts
export const getUsers = async (req, res) => {
    try {
        const users = await userService();

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};
```

This works, but the same error handling code gets repeated in every controller.

To avoid this, we use:

1. `asyncHandler`
2. `globalErrorHandler`

## asyncHandler Middleware

File:

```txt
src/middlewares/asyncHandler.ts
```

Code:

```ts
import { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
```

## How asyncHandler Works

The controller function is passed into `asyncHandler`.

```ts
asyncHandler(async (req, res) => {
    const data = await serviceFunction();
    res.status(200).json({ success: true, data });
});
```

Internally, `asyncHandler` runs the controller inside `Promise.resolve()`.

```ts
Promise.resolve(fn(req, res, next)).catch(next);
```

If the controller runs successfully, the response is sent normally.

If the controller throws an error, or if an awaited service/repository function fails, `.catch(next)` sends that error to Express.

Express then passes the error to the global error handler.

## Controller Without Try/Catch

Example:

```ts
import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { getAllWorkshopsService } from "./workShop.service.js";

export const getAllWorkshops = asyncHandler(async (req: Request, res: Response) => {
    const workshops = await getAllWorkshopsService();

    res.status(200).json({
        success: true,
        message: "Workshops fetched successfully",
        data: workshops
    });
});
```

No `try/catch` is needed here.

If `getAllWorkshopsService()` throws an error, `asyncHandler` catches it automatically and calls `next(error)`.

## Global Error Handler

File:

```txt
src/middlewares/globalErrorHandler.ts
```

Code:

```ts
import { Request, Response, NextFunction } from "express";

const getStatusCode = (error: any) => {
    if (error.statusCode) {
        return error.statusCode;
    }

    if (error.message === "Invalid email or password") {
        return 401;
    }

    if (
        error.message === "User with this email or phone already exists" ||
        error.message === "All required fields must be provided" ||
        error.message === "Workshop details are required for WORKSHOP_OWNER"
    ) {
        return 400;
    }

    return 500;
};

export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = getStatusCode(error);

    res.status(statusCode).json({
        success: false,
        message: error.message || "Internal server error"
    });
};
```

## How Global Error Handler Works

Express recognizes error middleware by its four parameters:

```ts
(error, req, res, next)
```

When `next(error)` is called from `asyncHandler`, Express skips normal middleware and sends the error to this handler.

The handler decides the HTTP status code and sends one common error response format:

```json
{
    "success": false,
    "message": "Error message here"
}
```

## App Setup

The global error handler must be registered after all routes.

File:

```txt
src/app.ts
```

Code:

```ts
app.use("/api", router);
app.use(errorHandler);
```

Order matters.

Routes run first. If any route throws an error, `asyncHandler` sends it to `errorHandler`.

## Complete Flow

1. Client calls an API.
2. Route calls controller.
3. Controller is wrapped with `asyncHandler`.
4. Controller calls service.
5. Service calls repository.
6. If everything works, controller sends success response.
7. If anything throws an error, `asyncHandler` catches it.
8. `asyncHandler` calls `next(error)`.
9. Express sends the error to `globalErrorHandler`.
10. `globalErrorHandler` sends the final error response.

## Benefit

Before:

```ts
try {
    // API logic
} catch (error) {
    // Error response
}
```

After:

```ts
export const apiName = asyncHandler(async (req, res) => {
    // API logic only
});
```

This keeps controllers clean and makes error responses consistent across the project.
