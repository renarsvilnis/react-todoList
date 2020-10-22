import express, {Request, Response} from 'express';
import { User, IUser } from '../models/user.model';
import { AuthHelper } from '../common/auth.helper';
import * as bcrypt from 'bcrypt';

const router = express.Router();

router.post('/api/user/register', (req: Request, res: Response) => {
    let userData: IUser = req.body;
    const plainPassword = userData.password;
    bcrypt.hash(plainPassword, 10)
        .then( (hashedPassword) => {
            userData.password = hashedPassword;
            const user = User.build(userData);
            user.save(
                (err, user) => {
                    if(user) {
                        const auth:AuthHelper = new AuthHelper();
                        //res.setHeader('Set-Cookie', [auth.createCookie(user)]);
                        return res.status(201).send({status: 'OK', token: auth.createCookie(user)});
                   } else {
                       let ErrorMessage = {error_message: "Something went wrong"};
                       // dublicate key
                       if ((err.name === 'MongoError') && (err.code === 11000)) {
                           ErrorMessage = {error_message: "Try different username/password combination"};
                       }
                       return res.status(500).send(ErrorMessage);
                   }
               }
            );
        })
})

router.put('/api/user/login', (req: Request, res: Response) => {
    const userData: IUser = req.body;
    const plainPassword = userData.password;
    const login = userData.login;
    const genericErrorMsg = {error_message: "Password or username is incorrect"};
    
    User.findOne({login:login})
        .then((user) => {
            if (user) {
                bcrypt.compare(plainPassword, user.password)
                    .then((passwordsMatch) => {
                        if (passwordsMatch) {
                            // all good
                            const auth:AuthHelper = new AuthHelper();
                            //res.setHeader('Set-Cookie', [auth.createCookie(user)]);
                            return res.status(200).send({status: 'OK', token: auth.createCookie(user)});
                        } else {
                            // invalid pass
                            return res.status(500).send(genericErrorMsg);
                        }
                    })
            } else {
                // user not found
                return res.status(500).send(genericErrorMsg);
            }
        })
});

router.put('/api/user/logout', (req: Request, res: Response) => {
    res.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    res.sendStatus(200);
});

export { router as userRouter }
