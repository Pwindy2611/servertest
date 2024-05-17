import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { genSalt, hash, compare } from "bcrypt";//hash mk

let refreshTokens=[];//fake database to save refresh token
const authController = {
    //REGISTER
    registerUser: async(req,res)=>{
        try{
            //Hash password(bam va ma hoa voi muoi)
            const salt =await genSalt(10);
            const hashedPassword = await hash(req.body.password,salt);

            //Create new user
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password:  hashedPassword
            });
            const user = await newUser.save();
            return res.status(201).json(user);
        }
        catch(err){
            console.log(err);
        }
    },
    
    //GENERATE  TOKEN
    generateToken: (user,time,key) => {
        return jwt.sign({
            id: user.id,
            admin:user.admin,
        },
        key,
        {expiresIn: time}
    );
    },
    
    //LOGIN
    loginUser: async(req,res)=>{
        try{
            const user = await User.findOne({username:req.body.username});//tim user name trong database
            if(!user){
                return res.status(404).json("User not found");
            }
            const validPassword = await compare(req.body.password,user.password);
            if(!validPassword) {
                return res.status(400).json("Invalid credentials");
            }
            if((user && validPassword)) {
            const accessToken= authController.generateToken(user,"30s",process.env.JWT_ACCESS_KEY);
            const refreshToken = authController.generateToken(user,"365d",process.env.JWT_REFRESH_TOKEN);
            refreshTokens.push(refreshToken);
            res.cookie("refreshToken",refreshToken,{
                httpOnly:true,
                path:"/",
                sameSite:"strict",
                secure:false,
            });
            const{password,...others}=user._doc;
            return res.status(200).json({...others,accessToken}); 
            }
        }
        catch(err){
            return res.status(500).json(err);
            console.log(err)
        }
    },

    //REFRESH TOKEN
    requestRefreshToken: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json("Unauthorized");
        }
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json( "Refresh token is not valid!" );
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, async (err, user) => {
            if (err) {
                console.log("Token verification error:", err);
                return res.status(403).json("Token is not valid");
            }
            // Fetch user from the database to get complete user info
            try {
                if (!user) {
                    return res.status(404).json("User not found" );
                }
                refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
                const newAccessToken = authController.generateToken(user,"30s",process.env.JWT_ACCESS_KEY);
                const newRefreshToken = authController.generateToken(user,"365d",process.env.JWT_REFRESH_TOKEN);
                refreshTokens.push(newRefreshToken);
                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    path: "/",
                    sameSite: "strict",
                    secure: false,
                });
                return res.status(200).json({ accessToken: newAccessToken });
            } catch (error) {
                console.log("Database fetch error:", error);
                return res.status(500).json("Internal server error");
            }
        });
    },

    //LOGOUT
    logoutUser: async (req, res) => {
        res.clearCookie("refreshToken");
        refreshTokens = refreshTokens.filter(
          (token) => token !== req.cookies.refreshToken
        );
        res.status(200).json("Logged out !");
      },
}
export default authController;