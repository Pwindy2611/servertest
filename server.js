const express =require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const authRouter=require('./routes/auth');
const userRouter=require('./routes/user');

dotenv.config();
const app=express();

mongoose.set('strictQuery', false);

mongoose.connect('mongodb://127.0.0.1:27017').then(() => {
  console.log(`successfully connected`);
}).catch((e) => {
  console.log(`not connected`);
}); 

app.use(cors());
app.use(cookieParser());
app.use(express.json());

//ROUTES
app.use("/v1/auth",authRouter);
app.use("/v1/user",userRouter);
app.listen(8000,() =>{
    console.log('server is running on port 8000');
});