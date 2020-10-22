import mongoose from 'mongoose';

enum TaskType {
    regular,
    workTask,
    food
}

interface ITask {
    title: string,
    type: TaskType,
    subTasks: Array<mongoose.Types.ObjectId>,
    done: boolean,
    price: number,
    description: string,
    pictureURL: string
}

interface ITaskDocument extends mongoose.Document {
    title: string,
    type: TaskType,
    subTasks: Array<mongoose.Types.ObjectId>, //link to another List
    done: boolean,
    price: number,
    description: string,
    pictureURL: string
}

interface ITaskModel extends mongoose.Model<ITaskDocument> {
    build(input: ITask): ITaskDocument
}

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    type: {
        type: String,
        enum: Object.values(TaskType),
        required: true
    },
    subTasks: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "List",
        required: false
    },
    done: {
        type: Boolean,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    pictureURL: {
        type: String,
        required: false
    },
})

taskSchema.statics.build = (input: ITask) => {
    return new Task(input)
}

const Task = mongoose.model<ITaskDocument, ITaskModel>('Task', taskSchema);

export { Task, ITask, taskSchema }