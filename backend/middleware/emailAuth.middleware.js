import { ApiError } from "../lib/ApiError.js";
import { asyncHandler } from "../lib/AsyncHandler.js";

export const emailAuthMiddleware = asyncHandler(async (req, res, next) => {
    // checking for email Token
    if (!req.emailToken) {
        const error = "Unauthorized - Invalid token.";
        throw new ApiError(401, error);
    }
    next();
});
