import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser";
const app=express();
 
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json({extended:true}));
app.use(express.urlencoded({extended:true,limit:"12kb"}));
app.use(cookieParser);



//routes
import authRouter from './routes/auth.routes.js'
import aiRouter from './routes/ai.routes.js'
import recipeRouter from './routes/recipe.routes.js'
app.use('/api/users',authRouter)
app.use('/api/recipes/',recipeRouter)
app.use('/api/ai',aiRouter)
export {app}