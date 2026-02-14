import mongoose from 'mongoose'
const dbConnect=async()=>{
  try{
   const conn= await mongoose.connect(process.env.MONGO_URI);
   console.log("mongodb connected");

  }catch(err){
    console.log("error occured while connecting db");
    process.exit(1);
  }
}
export default dbConnect;