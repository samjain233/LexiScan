import { ApiResponse } from "../../lib/ApiResponse.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import { ApiError } from "../../lib/ApiError.js";
import Blog from "../../models/blog.model.js";

export const upvoteBlogController = asyncHandler(async (req, res) => {
    const { slug } = req.body;
    const userId = req.user._id;

    const blog = await Blog.findOne({ slug });
    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }
    if (blog.upvotes.includes(userId)) {
        blog.upvotes.pop(userId);
        await blog.save();
        return res.status(200).json(new ApiResponse(200, "upvote removed"));
    } else {
        blog.upvotes.push(userId);
        await blog.save();
        return res
            .status(200)
            .json(new ApiResponse(200, "Blog upvoted successfully"));
    }
});

export const getNoOfUpvotes = asyncHandler(async (req, res) => {
    const { slug } = req.body;
    const blog = await Blog.findOne({ slug: slug });
    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }
    const countNoOfUpvotes = blog.upvotes.length;
    return res
        .status(200)
        .json(new ApiResponse(200, "count found", { countNoOfUpvotes }));
});
