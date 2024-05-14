const User = require("../models/User")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");//hash mk

let refreshTokens=[];//fake database to save refresh token
const authController = {
    //REGISTER
    registerUser: async(req,res)=>{
        try{
            //Hash password(bam va ma hoa voi muoi)
            const salt =await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password,salt);

            //Create new user
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password:  hashedPassword
            });
            const user = await newUser.save();
            res.status(201).json(user);
        }
        catch(err){
            console.log(err);
        }
    },
    //GENERATE ACCESS TOKEN
    generateToken: (user,time,key) => {
        return jwt.sign({
            id: user._id,
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
                return res.status(404).json({msg:"User not found"});
            }
            const validPassword = await bcrypt.compare(req.body.password,user.password);
            if(!validPassword) {
                return res.status(400).json({msg:"Invalid credentials"});
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
            res.status(200).json({...others,accessToken}); 
            }
        }
        catch(err){
            res.status(500).json(err);
        }
    },

    //REFRESH TOKEN
    requestRefreshToken: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json({ msg: "Refresh token is not valid!" });
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, async (err, user) => {
            if (err) {
                console.log("Token verification error:", err);
                return res.status(403).json({ msg: "Token is not valid" });
            }
            // Fetch user from the database to get complete user info
            try {
                const dbUser = await User.findById(user.id);
                if (!dbUser) {
                    return res.status(404).json({ msg: "User not found" });
                }
                refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
                const newAccessToken = authController.generateToken(dbUser, "30s", process.env.JWT_ACCESS_KEY);
                const newRefreshToken = authController.generateToken(dbUser, "365d", process.env.JWT_REFRESH_TOKEN);
                refreshTokens.push(newRefreshToken);
                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    path: "/",
                    sameSite: "strict",
                    secure: false,
                });
                res.status(200).json({ accessToken: newAccessToken });
            } catch (error) {
                console.log("Database fetch error:", error);
                res.status(500).json({ msg: "Internal server error" });
            }
        });
    },

    //LOGOUT
    logoutUser: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        refreshTokens = refreshTokens.filter((token) => token!== refreshToken);
        res.clearCookie("refreshToken", { path: "/" });
        res.status(200).json({ msg: "Logged out successfully" });
    },
}
module.exports = authController;