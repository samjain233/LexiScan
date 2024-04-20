import { ApiError } from "../../lib/ApiError.js";
import { ApiResponse } from "../../lib/ApiResponse.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import Blog from "../../models/blog.model.js";
import User from "../../models/user.model.js";

export const getAllUserBlogsController = asyncHandler(async (req, res) => {
    const user = req.user;
    const userId = user._id;

    const allUserBlogs = await User.findById(userId)
        .populate({
            path: "blogs",
            select: "title imageUrl active slug views upvotes",
        })
        .select({ blogs: 1 });

    res.status(200).json(
        new ApiResponse(200, "all user blogs fetched", allUserBlogs),
    );
});
