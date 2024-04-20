import { ApiError } from "../../lib/ApiError.js";
import { ApiResponse } from "../../lib/ApiResponse.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import { VerifyPassword } from "../../lib/HashPassword.js";
import { createAccessToken, createRefreshToken } from "../../lib/JwtToken.js";
import User from "../../models/user.model.js";

export const loginController = asyncHandler(async (req, res) => {
    //input validation-------------------------------------------
    const requiredFields = ["email", "password"];
    const missingFields = requiredFields.filter(
        (field) => !(field in req.body),
    );

    //check for missing field
    if (missingFields.length > 0) {
        const error = `Missing required fields: ${missingFields.join(", ")}`;
        throw new ApiError(400, error);
    }

    let { email, password } = req.body;

    // Validate data types
    if (typeof email !== "string" || typeof password !== "string") {
        const error = "All fields must be of type string.";
        throw new ApiError(400, error);
    }

    email = email.toLowerCase();

    //check if user exists ----------------------------------------
    const user = await User.findOne({ email });
    if (!user) {
        const error = "Invalid email or password.";
        throw new ApiError(400, error);
    }
    //---------------------------------------------------------------

    //verifying password ------------------------------------------------
    const hash = user.password;
    const verified = await VerifyPassword(password, hash);
    if (!verified) {
        const error = "Invalid email or password.";
        throw new ApiError(400, error);
    }
    //---------------------------------------------------------------

    //checking for verified email------------------------------------
    if (user.isVerified === false) {
        const error = "Email is not Verified.";
        throw new ApiError(400, error);
    }

    //generating auth token --------------------------------------------
    const userId = user._id;
    const accessToken = await createAccessToken(userId);
    const refreshToken = await createRefreshToken(userId);
    //---------------------------------------------------------------

    //saving refresh token in db----------------------------------------
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { refresh: refreshToken },
        { new: true },
    );
    if (updatedUser.refresh !== refreshToken) {
        const error = "some error occured, unable to login.";
        throw new ApiError(400, error);
    }
    //------------------------------------------------------------------

    const message = "login successfull.";
    const data = {
        accessToken
    };
    res.status(200).json(new ApiResponse(200, message, data));
});
