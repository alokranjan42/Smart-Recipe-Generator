import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema=mongoose.Schema({
    email:{
        required:true,
        type:String,
        unique:true,
        trim:true
    },
    fullname:{
        required:true,
        type:String
        
    },
    password:{
        required:true,
        type:String,

    }
},{timestamps:true})

userSchema.pre("save",async function(next){
    if(this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10);
    next();
})


userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);

}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        id:this._id
    },
    process.env.ACCESS_TOKEN_SECRET
    ,{
       
        maxAge:'7h'
    })
}
userSchema.methods.generateRefreshToken=async function(){
    return jwt.sign({
        id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET
    ,{
        maxAge:'3d'
    })
}

export const  User=mongoose.model("User",userSchema);