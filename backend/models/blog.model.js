import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        slug: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        title: {
            type: String,
            required: true,
        },
        keywords: {
            type: Array,
            required: true,
            default: [],
        },
        content: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
        },
        category: {
            type: String,
        },
        active: {
            type: Boolean,
            default: true,
        },
        comments: [
            {
                name: String,
                comment: String,
                default: [],
            },
        ],
        upvotes: [
            { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
        ],
        views: {
            type: Number,
            default: 0,
        },
        featured: {
            type: Boolean,
            default: false,
        },
        monthlyViews: [
            {
                month: String,
                views: Number,
                default: [],
            },
        ],
    },
    {
        timestamps: true,
    },
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
