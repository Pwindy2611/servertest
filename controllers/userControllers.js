const User = require("../models/User")

const userController = {
    getAllUsers: async(req, res) =>{
        try{
            const user = await User.find();
            res.status(200).json(user);
        }
        catch(err){
            res.status(500).json(err);
        }
    },
    
    deteleUsers: async(req, res) =>{
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json(user);
        }
        catch(err){
            res.status(500).json(err);
        }
    }
}

module.exports = userController;