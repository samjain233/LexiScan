import { ApiError } from "../../lib/ApiError.js";
import { ApiResponse } from "../../lib/ApiResponse.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import User from "../../models/user.model.js";

export const getUserProfileController = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const data = await User.findById(userId).select({
        username: 1,
        blogs: 1,
        followers: 1,
    });
    if (!data) {
        throw new ApiError(404, "user not found");
    }
    const blogCount = data.blogs.length;
    const followersCount = data.followers.length;
    const UserData = {
        username: data.username,
        blogCount,
        followersCount,
    };
    return res.status(200).json(new ApiResponse(200, "user found", UserData));
});
