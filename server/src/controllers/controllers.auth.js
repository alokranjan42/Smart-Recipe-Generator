import {User} from '../models.js'
import {Asynchandler} from '../utils/Asynchandler.js'
import {Apiresponse} from '../utils/Apiresponse.js'
import {ApiError } from '../utils/ApiError.js'
import bcrypt from 'bcrypt'

const registerUser=Asynchandler(async(req,res)=>{

    const {email,fullname,password}=req.body;
    if(!email||!fullname||!password){
        throw new ApiError(409,"missing details")
    }
    const existedUser=await User.findOne({email});
    if(existedUser){
        throw new ApiError(400,"user already existed")
    }
    const user=await User.create({
        email,fullname,password
    })
    if(!user){
        throw new ApiError(404,"user not found");
    }

    const accesstoken=user.generateAccessToken();
    const refreshtoken=user.generateRefreshToken();

    res.status(202)
    .cookie('accesstoken',accesstoken,{
        httpOnly:true,
        secure:true
    })
    .cookie('refreshtoken',refreshtoken,{
        httpOnly:true,
        secure:true
    })
    .json(new Apiresponse(202,"user registered successfully",user))

})
const loginUser=Asynchandler(async(req,res)=>{
    const {email,password}=req.body
    if(!email||!password){
        throw new ApiError(404,"missing details")
    }
    const user=await User.findOne({email});
    if(user){
        throw new ApiError(404,"user not exist")
    }
    const isPassword=bcrypt.compare(password,user.password)
    if(!isPassword){
        throw new ApiError(405,"wrong password")
    }
    const accesstoken=user.generateAccessToken();
    const refreshtoken=user.generateRefrehToken();

    res.status(200)
    .cookie('accesstoken',accesstoken,{
        httpOnly:true,
        secure:true
    })
    .cookie('refreshtoken',refreshtoken,{
        httpOnly:true,
        secure:true

    })
    .json(new Apiresponse(200,"user logged in successfully",user))

})

const getUser=Asynchandler(async(req,res)=>{
    const id=req.params.id
    const user=await User.findById({id})
    if(!user){
        throw new ApiError(404,"user does not exist")
    }
    res.staus(202)
    .json(new Apiresponse(202,"user found",user))

})
const refreshToken=Asynchandler(async(req,res)=>{
  const token=req.cookies.accesstoken()
  if(!token){
    throw new ApiError(404,"token not found")
  }
  const decodedToken=await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
  if(!decodedToken){
    throw new ApiError(404,"accesstoken not found")
  }
  const user=await User.findById(decodedToken)
  const accesstoken=user.generateAccessToken()
  const refreshtoken=user.generateRefreshTOken()

  res.status(202)
  .cookie('accesstoken',accesstoken,{
    httpOnly:true,
    secure:true
  })
   .cookie('resfreshtoken',refreshtoken,{
    httpOnly:true,
    secure:true
  })
  .json(new Apiresponse(202,'token generated Succefully'))
})
const logoutUser=Asynchandler(async(req,res)=>{
    res.status(200)
    .clearCookie('accesstoken',accesstoken)
    .clearCookie('refreshtoken',refreshtoken)
})
const deleteUser=Asynchandler(async(req,res)=>{
    const id=req.params.id
    const user=await User.findById({id})


})

export {
    registerUser,
    getUser,
    deleteUser,
    logoutUser,
    refreshToken,
    loginUser



}