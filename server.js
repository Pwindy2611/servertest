import express, { json } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { set, connect } from 'mongoose';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';

config();
const app=express();
const URL = process.env.DB_URL
 
set('strictQuery', false);

connect(URL).then(() => {
  console.log(`successfully connected`);
}).catch((e) => {
  console.log(`not connected`);const router = express.Router();
}); 

app.use(cors({
  credentials: true,
  origin:(_,callback)=>callback(null,true),
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH','OPTIONS'],
  optionsSuccessStatus:200,
}));

app.use(cookieParser());
app.use(json());

app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  console.log('Request Headers:', req.headers); // In ra tất cả các tiêu đề của yêu cầu
  next();
});

//ROUTES
app.use("/v1/auth",authRouter);
app.use("/v1/user",userRouter);
app.listen(8000,() =>{
    console.log('server is running on port 8000');
});

//JSON WEB TOKEN  
