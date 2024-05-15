import jwt from "jsonwebtoken";

const middlewareController = {
    verifyToken: async (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json({ msg: "Token is not valid" });
                }
                req.user = user;
                next();
            });
        } else {
            return res.status(401).json("You're not authenticated");
        }
    },

    verifyTokenAndAdminAuth: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user.id == req.params.id || req.user.admin)//khi la chinh user hoac admin thi se delete dc 
            {
                next();
            } else {
                return res.status(403).json({ msg: "You're not allowed to access this" });
            }
        });
    }
};

export default middlewareController;
