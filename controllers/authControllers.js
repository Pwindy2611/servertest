const User = require("../models/User")
const bcrypt = require("bcrypt");//hash mk

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
                res.status(200).json({msg:"Logged in successfully"});
            }
        }
        catch(err){
            res.status(500).json(err);
        }
    }
}
module.exports = authController;