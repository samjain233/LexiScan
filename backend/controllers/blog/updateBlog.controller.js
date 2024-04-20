import { ApiResponse } from "../../lib/ApiResponse.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import Blog from "../../models/blog.model.js";
import { ApiError } from "../../lib/ApiError.js";

export const updateBlogController = asyncHandler(async (req, res) => {
    const { slug, title, content, imageUrl, keywords, category, blogId } =
        req.body;
    const user = req.user;

    const index = user.blogs.indexOf(blogId);
    if (index === -1) {
        throw new ApiError(403, "Unauthorized");
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
        slug,
        title,
        content,
        imageUrl,
        keywords,
        category,
    });
    res.status(200).json(new ApiResponse(200, "blog Updated"));
});
