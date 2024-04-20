import { DEBUG } from "../constants/constants.js";

const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        console.error(error);
        if (DEBUG === true) {
            res.status(error.statusCode || 500).json({
                success: false,
                statusCode: error?.statusCode,
                message: error.message,
                errors: error?.errors,
                stack: error?.stack,
            });
        } else {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message,
            });
        }
    }
};

export { asyncHandler };
