import { ApiError } from "../../lib/ApiError.js";
import { ApiResponse } from "../../lib/ApiResponse.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import { HashPassword } from "../../lib/HashPassword.js";
import User from "../../models/user.model.js";

export const updatePasswordController = asyncHandler(async (req, res) => {
    
    const requiredFields = ["password"];
    const missingFields = requiredFields.filter(
        (field) => !(field in req.body),
    );

    //check for missing field
    if (missingFields.length > 0) {
        const error = `Missing required fields: ${missingFields.join(", ")}`;
        throw new ApiError(400, error);
    }

    let { password } = req.body;

    // Validate data types
    if (typeof password !== "string") {
        const error = "Password field must be of type string.";
        throw new ApiError(400, error);
    }

    // Password complexity validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!password.match(passwordRegex)) {
        const error =
            "Password must be at least minimum eight characters, at least one letter and one number.";
        throw new ApiError(400, error);
    }
    //---------------------------------------------------------------------------------------------------

    //hashing password -----------------------------------------
    const hashedPassword = await HashPassword(password);
    //--------------------------------------------------------------

    
    //updating the user ------------------------------------------------
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            password: hashedPassword,
        },
        {
            new: true,
        },
    );
    if (updatedUser.password === hashedPassword) {
        const message = "Password Updated Successfully.";
        res.status(200).json(new ApiResponse(200, message));
    } else {
        throw new ApiError(500, "Unable to update password.");
    }
});
