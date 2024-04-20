import mongoose from "mongoose";
import { ApiError } from "../../lib/ApiError.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import { getTokenData } from "../../lib/JwtToken.js";
import User from "../../models/user.model.js";
import { ApiResponse } from "../../lib/ApiResponse.js";

export const emailVerificationController = asyncHandler(async (req, res) => {
    const user = req.user;
    if (user.isVerified === false) {
        //setting verification status to true
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                isVerified: true,
            },
            { new: true },
        );
        if (updatedUser.isVerified === true) {
            const message =
                "Email Verification Successfull, Login to continue.";
            res.status(200).json(new ApiResponse(200, message));
        } else {
            const error = "Unable to verify email.";
            throw new ApiError(404, error);
        }
    }
    const error = "Email is already verified.";
    throw new ApiError(404, error);
});
