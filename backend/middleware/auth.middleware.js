import mongoose from "mongoose";
import { ApiError } from "../lib/ApiError.js";
import { asyncHandler } from "../lib/AsyncHandler.js";
import { getTokenData } from "../lib/JwtToken.js";
import User from "../models/user.model.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.header("Authorization");

    //checking for token -------------------------------------------
    if (!token) {
        const error = "Unauthorized - No token provided.";
        throw new ApiError(401, error);
    }
    //------------------------------------------------------------

    //getting token data  -------------------------------------------
    const trimmedToken = token.replace("Bearer ", "");
    const userData = await getTokenData(trimmedToken);
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
    const user = await User.findById(userData._id);
    if (!user) {
        const error = "Unauthorized - Invalid token.";
        throw new ApiError(401, error);
    }
    //----------------------------------------------------------------------------

    req.user = user;
    req.emailToken = userData?.email;
    next();
});
