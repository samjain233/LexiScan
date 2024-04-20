import mongoose from "mongoose";
import { ApiError } from "../../lib/ApiError.js";
import { ApiResponse } from "../../lib/ApiResponse.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import { createAccessToken, getRefreshTokenData } from "../../lib/JwtToken.js";
import User from "../../models/user.model.js";

export const generateAccessTokenController = asyncHandler(async (req, res) => {
    const refreshToken = req.header("Authorization");

    //checking for token -------------------------------------------
    if (!refreshToken) {
        const error = "Unauthorized - No token provided.";
        throw new ApiError(401, error);
    }
    //------------------------------------------------------------

    //getting token data  -------------------------------------------
    const trimmedToken = refreshToken.replace("Bearer ", "");
    const userData = await getRefreshTokenData(trimmedToken);
    if (!userData) {
        const error = "Unauthorized - Invalid token.";
        throw new ApiError(401, error);
    }
    //---------------------------------------------------------------

    //if the key = _id is not present in the data----------------------------
    if (!userData.hasOwnProperty("_id")) {
        const error = "Unauthorized - Invalid token.";
        throw new ApiError(401, error);
    }
    //---------------------------------------------------------------------

    //checking for valid _id type-----------------------------------------------
    if (!mongoose.Types.ObjectId.isValid(userData._id)) {
        const error = "Unauthorized - Invalid token.";
        throw new ApiError(401, error);
    }
    //-------------------------------------------------------------------------------

    //checking existance of user in database---------------------------------------
    const user = await User.findById(userData._id, {
        email: 1,
        isVerified: 1,
        refresh: 1,
    });
    if (!user) {
        const error = "Unauthorized - Invalid token.";
        throw new ApiError(401, error);
    }
    //----------------------------------------------------------------------------

    //checking for same refresh token ----------------------------------------------
    console.log(user);
    console.log(refreshToken)
    if (user.refresh !== refreshToken) {
        const error = "Unauthorized - Invalid token.";
        throw new ApiError(401, error);
    }
    //------------------------------------------------------------------------------

    const accessToken = await createAccessToken(user._id);
    res.status(200).json(
        new ApiResponse(200, "Access token creation successfull.", {
            accessToken,
        }),
    );
});
