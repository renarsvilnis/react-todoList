import mongoose from 'mongoose';

interface IUser {
    login: string,
    password: string,
    lists: Array<mongoose.Types.ObjectId>,
}

interface IUserDocument extends mongoose.Document {
    login: string,
    password: string,
    lists: Array<mongoose.Types.ObjectId>,
}

interface IUserModel extends mongoose.Model<IUserDocument> {
    build(input: IUser): IUserDocument
}

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    lists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required: true
    }]
})

userSchema.statics.build = (input: IUser) => {
    return new User(input)
}

const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);

export { User, IUser, IUserDocument }