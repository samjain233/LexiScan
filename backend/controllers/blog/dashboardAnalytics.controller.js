import { ApiResponse } from "../../lib/ApiResponse.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import { ApiError } from "../../lib/ApiError.js";
import Blog from "../../models/blog.model.js";
import User from "../../models/user.model.js";

export const dashboardAnalyticsController = asyncHandler(async (req, res) => {
    const user = req.user;
    const UserData = await User.findById(user._id).populate("blogs");
    const { blogs, followers } = UserData;
    const noOfBlogs = blogs.length;
    const noOfFollowers = followers.length;
    const totalViews = blogs.reduce((total, blog) => total + blog.views, 0);
    const totalUpvotes = blogs.reduce(
        (total, blog) => total + blog.upvotes.length,
        0,
    );

    return res.status(200).json(
        new ApiResponse(200, "analytics fetched", {
            noOfBlogs,
            noOfFollowers,
            totalViews,
            totalUpvotes,
        }),
    );
});
