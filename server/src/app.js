import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser";

const app = express();


app.use(express.json());
app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.urlencoded({ extended: true, limit: "12kb" }));
app.use(cookieParser());
 
import authRouter from './routes/auth.routes.js'
import aiRouter from './routes/ai.routes.js'
import recipeRouter from './routes/recipe.routes.js'

app.use('/api/users', authRouter)
app.use('/api/recipes', recipeRouter)
app.use('/api/ai', aiRouter)

 
app.use((err, req, res) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || []
  });
});

export { app };
