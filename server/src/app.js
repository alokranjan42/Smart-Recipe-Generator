import express from 'express'
import cors from 'cors'

app.use(cors());
app.use(express.json({extended:true}));
app.use(express.urlencoded({extended:true,limit:"12kb"}));
app.use(cookieParser);


//routes
  
app.use('/api/user/auth')
app.use('/api/recipe/')