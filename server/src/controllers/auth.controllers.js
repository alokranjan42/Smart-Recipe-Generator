import { User } from '../models/user.models.js'
import { asyncHandler } from '../utils/AsyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";


  const cookieOptions = {
  httpOnly: true,
  secure: true,      
  sameSite: "none",       
};


 
const registerUser = asyncHandler(async (req, res) => {
  const { email, fullname, password } = req.body;

  if (!email || !fullname || !password) {
    throw new ApiError(400, "All details are required");
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({ email, fullname, password });

  const registeredUser = await User.findById(user._id).select("-password");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  return res.status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(201, registeredUser, "User registered successfully"));
});


 
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User does not exist");

  const isPassword = await bcrypt.compare(password, user.password);
  if (!isPassword) throw new ApiError(401, "Wrong password");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  const loggedUser = await User.findById(user._id).select("-password");

  return res.status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, loggedUser, "User logged in successfully"));
});


 
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) throw new ApiError(404, "User does not exist");

  return res.status(200).json(new ApiResponse(200, user, "User found"));
});


 
const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) throw new ApiError(401, "Token missing");

  const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decodedToken.id);

  if (!user) throw new ApiError(404, "User not found");

  const accessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  return res.status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .json(new ApiResponse(200, null, "Token refreshed successfully"));
});


 
const logoutUser = asyncHandler(async (req, res) => {
  return res.status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, null, "User logged out"));
});


 
const deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found");

  await User.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User deleted successfully"));
});

export {
  registerUser,
  loginUser,
  getUser,
  refreshToken,
  logoutUser,
  deleteUser,
};
