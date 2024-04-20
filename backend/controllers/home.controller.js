import { ApiResponse } from "../lib/ApiResponse.js";
import { asyncHandler } from "../lib/AsyncHandler.js";

export const homeController = asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, "server is up..."));
});
