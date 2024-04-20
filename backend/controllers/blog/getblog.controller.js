import { ApiError } from "../../lib/ApiError.js";
import { ApiResponse } from "../../lib/ApiResponse.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import Blog from "../../models/blog.model.js";

export const getBlogController = asyncHandler(async (req, res) => {
    const { slug } = req.query;

    const blogData = await Blog.findOne({ slug: slug }).populate("author");
    if (!blogData) {
        const message = "blog not found";
        throw new ApiError(400, message);
    }
    await Blog.updateOne({ slug: slug }, { $inc: { views: 1 } });
    res.status(200).json(
        new ApiResponse(200, "blog found successfull", blogData),
    );
});

export const getBlogUsingblogIdController = asyncHandler(async (req, res) => {
    const { blogId } = req.body;

    const blogData = await Blog.findById(blogId);
    if (!blogData) {
        const message = "blog not found";
        throw new ApiError(400, message);
    }
    res.status(200).json(
        new ApiResponse(200, "blog found successfull", blogData),
    );
});
