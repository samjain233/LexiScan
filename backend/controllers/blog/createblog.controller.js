import { ApiResponse } from "../../lib/ApiResponse.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import Blog from "../../models/blog.model.js";
import { ApiError } from "../../lib/ApiError.js";
import User from "../../models/user.model.js";

export const createBlogController = asyncHandler(async (req, res) => {
    const { slug, title, content, imageUrl, keywords, category } = req.body;
    const user = req.user;
    // // if (!user) {
    // //     const error = "Invalid user.";
    // //     throw new ApiError(400, error);
    // // }
    // const existingUser = await User.findById(user._id);
    // if (!existingUser) {
    //     throw new ApiError(404, "User not found.");
    // }

    const blog = await Blog.create({
        slug,
        title,
        content,
        imageUrl,
        keywords,
        category,
        author: user._id,
    });

    await User.findByIdAndUpdate(user._id, { $push: { blogs: blog._id } });
    res.status(200).json(new ApiResponse(200, "blog created"));
});
