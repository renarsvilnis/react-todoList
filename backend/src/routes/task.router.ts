import express, {Request, Response} from 'express';
import authMiddleware from '../common/auth.middleware';
import { Task, ITask } from '../models/task.model';
import { List } from '../models/list.model';
import { Mongoose, Types } from 'mongoose';

const router = express.Router();

function checkRights(listId:string ,req: Request, res: Response) {
    const currentUserId:Object = Types.ObjectId(req.headers.authorization);
    // verify that list actually exists and user has rights to edit it
    List.findOne({
        _id: listId,
        $or: [{owner: currentUserId}, {sharedWith: currentUserId}]
    }).then((list) => {
        if (!list) {
            return res.status(404).send('Invalid data');
        }
    });
}
  

router.all('/api/task*',authMiddleware);

router.post('/api/task/:listId', (req: Request, res: Response) => {
    const listId:string = req.params.listId;    
    const taskData: ITask = req.body;
    const task = Task.build(taskData);

    checkRights(listId, req, res);

    task.save(
        (err, task) => {
            if(task) {
                // create reference in list
                List.findByIdAndUpdate(listId, {$push: {tasks: Types.ObjectId(task._id)} })
                    .then((updated)=>{
                        if (updated) {
                            return res.status(201).send(task);
                        } else {
                            return res.status(500).send('Something went terribly wrong...');
                        }
                    });

           } else {
                console.log(err);
                return res.status(500).send('Something went terribly wrong...');
           }
       }
    );
})

router.put('/api/task/:listId/:taskId', (req: Request, res: Response) => {
    const taskId = req.params.taskId;
    const listId:string = req.params.listId;    

    checkRights(listId, req, res);

    const taskData: ITask = req.body;
    Task.replaceOne({ _id: taskId }, taskData)
        .then((replaceOperation)=> {
            if (replaceOperation.ok) {
                Task.findById(taskId)
                    .then((updatedTask) => {
                        if(updatedTask) {
                            return res.status(201).send(updatedTask);
                        } else {
                            return res.status(404).send('task not found');
                        }
                    })
            } else {
                return res.status(404).send('task not found');
            }
        })
})

router.delete('/api/task/:listId/:taskId', (req: Request, res: Response) => {
    const taskId = req.params.taskId;
    const listId = req.params.listId;

    checkRights(listId, req, res);

    Task.findByIdAndDelete(taskId)
        .then( (foundRecord) => {
            if (foundRecord) {

                // remove the reference from List
                List.updateOne(
                    {_id: listId, owner: req.headers.authorization}, 
                    { $pull: {tasks: Types.ObjectId(taskId) } }
                ).then()
                return res.status(201).send({status: 'OK'});
            } else {
                return res.status(404).send('task not found');
            }
        })
})

export { router as taskRouter }
