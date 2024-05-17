import User from "../models/User.js";

const userController = {
    getAllUsers: async(req, res) =>{
        try{
            const user = await User.find();
            return res.status(200).json(user);
        }
        catch(err){
            return res.status(500).json(err);
        }
    },
    
    deleteUser: async(req, res) =>{
        try{
            const user = await User.findById(req.params.id);
            return res.status(200).json("Delete Successfully!");
        }
        catch(err){
            return res.status(500).json(err);
        }
    }
}

export default userController ;