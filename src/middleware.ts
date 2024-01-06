import { Request, Response, NextFunction } from 'express';
import UserModel from './collections/User.collection';

export const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'No Auth Header Provided!' });
    }

    const encodedCredentials = authHeader.split(' ')[1];
    const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
    
    const [username, password] = decodedCredentials.split(':');

    try {
        const user = await UserModel.findOne({ username: username, password: password }).lean().exec();

        if (user) {
            next();  
        } else {
            return res.status(401).json({ message: 'Invalid User provided!' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error when authenticating user!', error: error });
    }
};
