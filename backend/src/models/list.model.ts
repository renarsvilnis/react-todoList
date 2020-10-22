import mongoose from 'mongoose';

interface IList {
    name: string,
    frozen: boolean,
    owner: mongoose.Types.ObjectId,
    tasks: Array<mongoose.Types.ObjectId>
    sharedWith: Array<mongoose.Types.ObjectId>
} 

interface IListDocument extends mongoose.Document {
    name: string,
    frozen: boolean,
    owner: mongoose.Types.ObjectId,
    tasks: Array<mongoose.Types.ObjectId>
    sharedWith: Array<mongoose.Types.ObjectId>
} 

interface IListModel extends mongoose.Model<IListDocument> {
    build(input: IList): IListDocument
}

const ListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    frozen: {
        type: Boolean,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true
    }],
    sharedWith: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }]

})

ListSchema.statics.build = (input: IList) => {
    return new List(input)
}

const List = mongoose.model<IListDocument, IListModel>('List', ListSchema);

export { List, IList }