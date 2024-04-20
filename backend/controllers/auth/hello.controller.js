import { asyncHandler } from "../../lib/AsyncHandler.js";

export const hello = asyncHandler(async(req,res)=>{
    res.send("hello");
})