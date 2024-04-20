import mongoose from "mongoose";
import { ApiError } from "../lib/ApiError.js";
import { asyncHandler } from "../lib/AsyncHandler.js";
import { getTokenData } from "../lib/JwtToken.js";
import User from "../models/user.model.js";

export const getIpMiddleware = asyncHandler(async(req,res,next)=>{
    const ip = req.connection.remoteAddress;
    console.log(ip);
    next();
})