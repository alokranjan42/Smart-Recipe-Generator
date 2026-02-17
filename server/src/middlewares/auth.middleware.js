import {AsyncHandler} from '../utils/AsyncHandler.js'
import {User} from '../models/models.user.js'
import jwt from 'jsonwebtoken'
import {ApiError} from '../utils/ApiError.js'


const authMiddleware=AsyncHandler(async(req,res,next)=>{
    const token=req.cookies?.accessToken||
    req.headers?.authorization?.replace("Bearer ","");
    if(!token){
        throw new ApiError(401,"missing tokens")
    }
    const decodedToken =  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    if(!decodedToken){
        throw new ApiError(401,"missing tokens ")
    }
    const user=await User.findById(decodedToken._id).select("-password")
    if(!user){
        throw new ApiError(404,"user not exist")
    }

    req.user=user;
    next();

})
export default authMiddleware