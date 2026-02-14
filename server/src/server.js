import dotenv from 'dotenv'
import dbConnect from './db/db.js'

const PORT=8005
dotenv.config()
dbConnect()
.then(()=>{
    app.listen(process.env.PORT||PORT,()=>{
        console.log(`server is running on port ${process.env.PORT}`);
    })
})
.catch((err)=>{
console.log("error occured while running server" );
})