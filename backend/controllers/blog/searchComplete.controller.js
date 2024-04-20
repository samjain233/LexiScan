import { ApiError } from "../../lib/ApiError.js";
import { ApiResponse } from "../../lib/ApiResponse.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import Blog from "../../models/blog.model.js";

export const searchCompleteController = asyncHandler(async (req, res) => {
    const { keyword } = req.body;
    const regex = new RegExp(keyword, "i");
    const blogs = await Blog.find({
        $or: [
            { title: regex },
            { category: regex },
            { keywords: { $elemMatch: { $regex: regex } } },
        ],
        active: true,
    }).select({
        title: 1,
        category: 1,
        slug: 1,
    });
    res.status(200).json(new ApiResponse(200, "blog found successfull", blogs));
});
