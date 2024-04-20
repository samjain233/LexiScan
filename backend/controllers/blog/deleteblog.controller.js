import { ApiResponse } from "../../lib/ApiResponse.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import { ApiError } from "../../lib/ApiError.js";
import Blog from "../../models/blog.model.js";

export const deleteBlogController = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    const user = req.user;
    const blog = await Blog.findById(blogId);
    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }
    if (!user._id.equals(blog.author)) {
        throw new ApiError(
            403,
            "Unauthorized: You are not the author of this blog",
        );
    }
    await Blog.findByIdAndDelete(blogId);
    user.blogs.pull(blogId);
    await user.save();
    return res
        .status(200)
        .json(new ApiResponse(200, "Blog deleted successfully"));
});
