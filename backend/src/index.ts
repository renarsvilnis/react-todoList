import express from 'express';

import mongoose from 'mongoose';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { listRouter } from './routes/list.router';
import { taskRouter } from './routes/task.router';
import { userRouter } from './routes/user.router';
import { staticRouter } from './routes/static.router';

const app = express();
app.use(json());
app.use(cookieParser());

app.use(cors({credentials: true}));

app.use(staticRouter);
app.use(listRouter);
app.use(taskRouter);
app.use(userRouter);

mongoose.connect('mongodb://localhost:27017/ubiquiti-homework', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log('Connected to DB on 27017');
})

app.listen(3001, () => {
    console.log('server is listening on port 3001');
});