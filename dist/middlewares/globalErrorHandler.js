const getStatusCode = (error) => {
    if (error.statusCode) {
        return error.statusCode;
    }
    if (error.message === "Invalid email or password") {
        return 401;
    }
    if (error.message === "User with this email or phone already exists" ||
        error.message === "All required fields must be provided" ||
        error.message === "Workshop details are required for WORKSHOP_OWNER" ||
        error.message === "Workshop id is required" ||
        error.message === "At least one field is required to update workshop" ||
        error.message === "No valid fields provided to update workshop" ||
        error.message === "User id is required" ||
        error.message === "At least one field is required to update user" ||
        error.message === "No valid fields provided to update user") {
        return 400;
    }
    if (error.message === "Workshop not found" ||
        error.message === "User not found") {
        return 404;
    }
    return 500;
};
export const errorHandler = (error, req, res, next) => {
    const statusCode = getStatusCode(error);
    res.status(statusCode).json({
        success: false,
        message: error.message || "Internal server error"
    });
};
