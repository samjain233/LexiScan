import { ApiError } from "../../lib/ApiError.js";
import { ApiResponse } from "../../lib/ApiResponse.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
import { HashPassword, VerifyPassword } from "../../lib/HashPassword.js";
import { createEmailVerificationToken } from "../../lib/JwtToken.js";
import User from "../../models/user.model.js";
import { sendMailService } from "../../services/mail/mail.services.js";

export const registerAdminController = asyncHandler(async (req, res) => {
    //input validation-------------------------------------------
    const requiredFields = ["username", "email", "password"];
    const missingFields = requiredFields.filter(
        (field) => !(field in req.body),
    );
    //check for missing field
    if (missingFields.length > 0) {
        const error = `Missing required fields: ${missingFields.join(", ")}`;
        throw new ApiError(400, error);
    }

    let { username, email, password } = req.body;

    // Validate data types
    if (
        typeof username !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string"
    ) {
        const error = "All fields must be of type string.";
        throw new ApiError(400, error);
    }

    //check for userName
    const trimmedUsername = username.replace(/\s/g, "");
    if (trimmedUsername.length < 6) {
        const error = "Username must have at least 6 characters.";
        throw new ApiError(400, error);
    }

    //check for email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        const error = "Invalid email format.";
        throw new ApiError(400, error);
    }

    // Password complexity validation
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    if (!password.match(passwordRegex)) {
        const error =
            "Password must be at minimum eight characters, at least one letter and one number.";
        throw new ApiError(400, error);
    }
    //-----------------------------------------------------------------

    //existing user check------------------------------------------
    email = email.toLowerCase();
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        const error = "email already in use, try using login.";
        throw new ApiError(400, error);
    }
    //-------------------------------------------------------------

    //hashing password -----------------------------------------
    const hashedPassword = await HashPassword(password);
    //--------------------------------------------------------------

    //creating new user -----------------------------------------------
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });
    //-----------------------------------------------------------------

    //checking user created ------------------------------------------------
    const checkCreatedUser = user?._id;
    if (checkCreatedUser) {
        // const emailToken = await createEmailVerificationToken(user._id);
        // console.log(emailToken);
        // sendMailService(user.email,"email Verification", emailToken);
        const message =
            "User Created Successfully, Login to continue";
        res.status(201).json(new ApiResponse(201, message));
    } else {
        throw new ApiError(500, "Some Error Occured");
    }
});
