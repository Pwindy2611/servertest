import express, { json } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { set, connect } from 'mongoose';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';

config();
const app=express();

set('strictQuery', false);

connect('mongodb://127.0.0.1:27017').then(() => {
  console.log(`successfully connected`);
}).catch((e) => {
  console.log(`not connected`);const router = express.Router();
}); 

app.use(cors());
app.use(cookieParser());
app.use(json());

app.post('localhost:8000/v1/auth/refresh', (req, res) => {
  console.log('Cookies:', req.cookies);
  console.log('Body:', req.body);
  res.send('Received');
});

app.use((req, res, next) => {
  console.log('Cookies:', req.cookies);
  next();
});

//ROUTES
app.use("/v1/auth",authRouter);
app.use("/v1/user",userRouter);
app.listen(8000,() =>{
    console.log('server is running on port 8000');
});

//JSON WEB TOKEN  
