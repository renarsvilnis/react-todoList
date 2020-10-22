import mongoose  from 'mongoose';
import {Request} from 'express';
import * as jwt from 'jsonwebtoken';

import {IUserDocument} from '../models/user.model';

interface ITokenData {
    token: string;
    expiresIn: number;
};

interface IDataInAuthHeader {
    id: string;
}

class AuthHelper {
    // normally this would be fetched from env variable or secret config file
    private secret = 'so-secret-much-wow-very-secret';

    private createToken(id: mongoose.Schema.Types.ObjectId): ITokenData {
        const expiresIn = 60 * 60; // an hour
        const dataStoredInCookie:IDataInAuthHeader = {
            id:id.toString()
        };
        const tokenData: ITokenData = { 
            expiresIn, 
            token: jwt.sign(dataStoredInCookie, this.secret, { expiresIn })
        } 
        return tokenData;
    };

    public createCookie(User: IUserDocument): string{
        const tokenData = this.createToken(User._id);
        const cookie = 
            "Authorization="+tokenData.token+";"+
            "HttpOnly;"+
            "Max-Age="+tokenData.expiresIn+";"
        const token = tokenData.token;
        return token
    }

    public validateToken(token: string| undefined): string {
        try {
            if (token) {
                const verifiedTokenData = jwt.verify(token, this.secret) as IDataInAuthHeader;
                return verifiedTokenData.id;
            }
          } catch (error) {
            console.log("Failed to validate token with: ");
            console.log(error);
            if (error instanceof jwt.TokenExpiredError) {
                // should relogin
            }
          }
        return ''
    }
}

export { AuthHelper }

