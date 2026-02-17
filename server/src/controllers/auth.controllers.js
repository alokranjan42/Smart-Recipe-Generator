import {User} from '../models.js'
import {AsyncHandler} from '../utils/AsyncHandler.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {ApiError } from '../utils/ApiError.js'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

const registerUser=AsyncHandler(async(req,res)=>{
     //taking details from frontend
    const {email,fullname,password}=req.body;
    
    if(!email||!fullname||!password){
        throw new ApiError(400,"missing  details are  required  ")
    }
    //checking user already exist or not 
    const existedUser=await User.findOne({email});
    if(existedUser){
        throw new ApiError(409,"user already existed")
    }
    //creating a new user
    const user=await User.create({
        email,fullname,password
    })
    if(!user){
        throw new ApiError(404,"user not found");
    }
    //removing the password before sending data
    const registeredUser=await User.findById(user._id).select('-password');

    //generating accesstoken and refreshtoken for login and refreshing tokens
    const accessToken=user.generateAccessToken();
    const refreshToken=user.generateRefreshToken();

     
   return  res.status(201)
   //creating cookies to for connection between client and server semalessly  
    .cookie('accessToken',accessToken,{
        httpOnly:true,
        secure:true
    })
    .cookie('refreshToken',refreshToken,{
        httpOnly:true,
        secure:true
    })
    //sending response 
    .json(new ApiResponse(201,registeredUser,"user registered successfully"))

})

//login user 
const loginUser=AsyncHandler(async(req,res)=>{

    //taking the details from frontend
    const {email,password}=req.body

// checking the required details
    if(!email||!password){
        throw new ApiError(400,"missing details")
    }
    //finding user it exists or not
    const user=await User.findOne({email});
    if(!user){
        throw new ApiError(404,"user not exist")
    }
    //if user exist then comparing the password 
    const isPassword=await bcrypt.compare(password,user.password)
    if(!isPassword){
        throw new ApiError(401,"wrong password")
    }

    //creating tokens
    const accessToken=user.generateAccessToken();
    const refreshToken=user.generateRefreshToken();

    //sending user detail without password

    const logedUser=await User.findById(user._id).select("-password")

    return res.status(200)
    //setting up cookies
    .cookie('accessToken',accessToken,{
        httpOnly:true,
        secure:true
    })
    .cookie('refreshToken',refreshToken,{
        httpOnly:true,
        secure:true

    })
    //sending response to frontend
    .json(new ApiResponse(200,logedUser,"user logged in successfully"))

})


//getting user 
const getUser=AsyncHandler(async(req,res)=>{
     
    //finding User in database
    const user=await User.findById(req.params.id).select("-password")
    if(!user){
        throw new ApiError(404,"user does not exist")
    }

    //returninn responses
    return res.status(200)
    .json(new ApiResponse(200,user,"user found" ))

})
const refreshToken=AsyncHandler(async(req,res)=>{
    //requesting the refreshtoken
  const token=req.cookies.refreshToken;
  if(!token){
    throw new ApiError(401,"token missing")
  }
  // verifing refresh token   with our env credetials 
  const decodedToken=  jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)
  if(!decodedToken){
    throw new ApiError(404,"accessToken not found")
  }
  //finding user with the decoded token
  const user=await User.findById(decodedToken._id)
  if(!user){
    throw new ApiError(404,"user not found")
  }
  //generating new tokens
   const accessToken=user.generateAccessToken();
   const refreshToken=user.generateRefreshToken();

   return res.status(200)
  .cookie('accessToken',accessToken,{
    httpOnly:true,
    secure:true
  })
   .cookie('refreshToken',refreshToken,{
    httpOnly:true,
    secure:true
  })
  .json(new ApiResponse(200,null,'token generated Succefully'))
})

//logout controller
const logoutUser=AsyncHandler(async(req,res)=>{

     
    return  res.status(200)
    //clearing all the saved  cookies
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json(new ApiResponse(200,null,"user logged out"))
    
})
const deleteUser=AsyncHandler(async(req,res)=>{
    //getting id from the url
    const id=req.params.id
 
    const user=await User.findById(id)

    if(!user){
        throw new ApiError(404,"user not found")
    }

    const deleteduser=await User.findByIdAndDelete(id)
    if(!deleteduser){
        throw new ApiError(400,"user not deleted")
    }
    
    return res.status(200)
    .json(new ApiResponse(200,null,"user deleted succesfully"))


})

export {
    registerUser,
    getUser,
    deleteUser,
    logoutUser,
    refreshToken,
    loginUser
}