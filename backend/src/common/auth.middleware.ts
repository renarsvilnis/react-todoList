import { NextFunction, Response, Request } from 'express';
import { AuthHelper } from './auth.helper';
import { User } from '../models/user.model';

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = new AuthHelper();
  const userId: string = auth.validateToken(req.headers.authorization);
  if (!userId.length) {
    res.status(400).send("Invalid token");
  }

  User.findById(userId)
    .then((user) => {
        if(user) {
            req.headers.authorization = user._id;
            next();
        } else {
            res.status(400).send("Invalid token");
        }
    })
}

export default authMiddleware;