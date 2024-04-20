import { ApiResponse } from "../../lib/ApiResponse.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import { ApiError } from "../../lib/ApiError.js";
import Blog from "../../models/blog.model.js";

//-------------------------------------------------------------------------------------------

const profanityList = ["fuck", "bastard", "ass", "sex"];

function createRegexPattern(word) {
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
    const pattern = [...escapedWord].map((char) => `${char}\\w*`).join(""); // Allow any number of optional characters between each letter

    return `\\b${pattern}\\b`;
}

const profanityPatterns = profanityList.map(createRegexPattern);
const combinedPattern = new RegExp(`(${profanityPatterns.join("|")})`, "gi");

function filterProfanity(input) {
    return input.replace(combinedPattern, (match) => "*".repeat(match.length));
}

//----------------------------------------------------------------------------------------------------------------

export const commentsBlogController = asyncHandler(async (req, res) => {
    const { slug, message } = req.body;
    const user = req.user;

    // Retrieve username from authenticated user
    const username = user.username;

    // Find the blog post by postId
    const blogPost = await Blog.findOne({ slug });

    // If blog post not found
    if (!blogPost) {
        throw new ApiError(404, "Blog post not found");
    }

    const profineMessage = filterProfanity(message);

    // Add comment to blog post
    blogPost.comments.push({ comment: profineMessage, name: username });

    // Save updated blog post
    await blogPost.save();

    res.status(200).json(new ApiResponse(200, "Comment added successfully"));
});

export const getCommentsBlogController = asyncHandler(async (req, res) => {
    const { slug } = req.body;
    const blogPost = await Blog.findOne({ slug }).select({ comments: 1 });
    // If blog post not found
    if (!blogPost) {
        throw new ApiError(404, "Blog post not found");
    }

    res.status(200).json(
        new ApiResponse(200, "Comment fetch successfully", blogPost),
    );
});
