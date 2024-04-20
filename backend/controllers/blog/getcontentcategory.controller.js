import { ApiResponse } from "../../lib/ApiResponse.js";
import { asyncHandler } from "../../lib/AsyncHandler.js";
const categories = [
  "Technology",
  "LifeStyle",
  "Travel",
  "Food",
  "Finance",
  "Health",
  "Education",
  "Parenting",
  "Fashion",
  "Sports",
  "Business"
];

export const getContentCategoryController = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, "Categories retrieved", { categories }));
});
