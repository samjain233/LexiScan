import { ApiResponse } from "../../lib/ApiResponse.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import User from "../../models/user.model.js";

export const logoutController = asyncHandler(async (req, res) => {
    const user = req.user;
    const userId = user._id;

    //deleting refreshToken from database ---------------------------------------
    await User.findByIdAndUpdate(
        userId,
        { $unset: { refresh: 1 } },
        { new: true },
    );
    //--------------------------------------------------------------------------

    res.status(200).json(new ApiResponse(200, "user logout successfull"));
});
