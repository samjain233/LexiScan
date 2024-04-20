import { ApiResponse } from "../../lib/ApiResponse.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import { ApiError } from "../../lib/ApiError.js";
import Blog from "../../models/blog.model.js";

export const updateactiveBlogController = asyncHandler(async (req, res) => {
    const { postId, isActive } = req.body;
    const user = req.user;

    const post = await Blog.findById(postId);
    if (!post) {
        const error = "post not found";
        throw new ApiError(404, error);
    }

    if (!user._id.equals(post.author)) {
        const error = "incorrect user";
        throw new ApiError(404, error);
    }

    post.active = isActive;
    await post.save();

    return res
        .status(200)
        .json(new ApiResponse(200, "Blog active status updated !!!"));
});
