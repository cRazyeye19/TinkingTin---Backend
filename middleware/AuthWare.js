import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.JWT_KEY;
const authMiddleWare = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (authorizationHeader && authorizationHeader.startsWith("Bearer")) {
            const token = authorizationHeader.split(" ")[1];
            if (token) {
                const decoded = jwt.verify(token, secret);
                req.user = decoded;
            }
        }
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export default authMiddleWare;
