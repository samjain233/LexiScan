import { ApiResponse } from "../../lib/ApiResponse.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import Blog from "../../models/blog.model.js";

export const getallTrendingBlogsController = asyncHandler(async (req, res) => {
    const allBlogs = await Blog.find({ active: true })
        .sort({ views: -1, upvotes: -1 })
        .populate({
            path: "author",
            select: "username",
        })
        .select({
            slug: 1,
            author: 1,
            title: 1,
            category: 1,
            views: 1,
            imageUrl: 1,
        })
        .limit(8);
    res.status(200).json(new ApiResponse(200, "getting all blogs", allBlogs));
});

export const getNewlyUploadedBlogsController = asyncHandler(
    async (req, res) => {
        const allBlogs = await Blog.find({ active: true })
            .sort({ createdAt: -1 })
            .populate({
                path: "author",
                select: "username",
            })
            .select({
                slug: 1,
                author: 1,
                title: 1,
                category: 1,
                views: 1,
                imageUrl: 1,
            })
            .limit(8);
        res.status(200).json(
            new ApiResponse(200, "getting all blogs", allBlogs),
        );
    },
);

export const getFeaturedPostController = asyncHandler(async (req, res) => {
    const allBlogs = await Blog.find({ featured: true })
        .populate({
            path: "author",
            select: "username",
        })
        .select({
            slug: 1,
            author: 1,
            title: 1,
            category: 1,
            views: 1,
            imageUrl: 1,
        })
        .limit(8);
    res.status(200).json(new ApiResponse(200, "getting all blogs", allBlogs));
});
