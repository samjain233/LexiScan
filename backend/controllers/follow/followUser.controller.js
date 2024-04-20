import { ApiError } from "../../lib/ApiError.js";
import { ApiResponse } from "../../lib/ApiResponse.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import User from "../../models/user.model.js";

export const followUserController = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const user = req.user;
    const myId = user._id;
    const bloggerData = await User.findById(userId).select({
        username: 1,
        followers: 1,
    });
    bloggerData.followers.push(myId);
    await bloggerData.save();
    user.following.push(userId);
    await user.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "you started following " + bloggerData.username,
            ),
        );
});

export const unfollowUserController = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const user = req.user;
    const myId = user._id;
    const bloggerData = await User.findById(userId).select({
        username: 1,
        followers: 1,
    });
    bloggerData.followers.pop(myId);
    await bloggerData.save();
    user.following.pop(userId);
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, "you unfollowed " + bloggerData.username));
});

export const checkIfIFollowController = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const user = req.user;
    let following = false;
    if (user.following.includes(userId)) {
        following = true;
    }
    return res.status(200).json(
        new ApiResponse(200, "api for checking if i following the user", {
            following,
        }),
    );
});
