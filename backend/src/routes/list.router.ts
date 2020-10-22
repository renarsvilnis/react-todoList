import express, {Request, Response} from 'express';
import { List, IList } from '../models/list.model';
import authMiddleware from '../common/auth.middleware';
import { Types } from 'mongoose';
import { User } from '../models/user.model';

const router = express.Router();

router.all('/api/list*',authMiddleware);

router.get('/api/list/all', (req: Request, res: Response) => {
    const requesterId = Types.ObjectId(req.headers.authorization);

    List.find({
        $or: [{owner: requesterId}, {sharedWith: requesterId}]
    }).populate('tasks')
    .then( (lists) => {
            if (lists) {
                return res.status(200).send(lists)
            } else {
                return res.status(404).send('Not found')
            }
    }).catch(
        err => {
            console.log(err);
        }
    )
})

router.get('/api/list/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    List.findById(id)
        .then( (list) => {
            if (list) {
                return res.status(200).send(list)
            } else {
                return res.status(404).send('Not found')
            }
        })
})

router.post('/api/list', (req: Request, res: Response) => {
    const listData: IList = {...req.body, owner: req.headers.authorization};
    const list = List.build(listData);
    list.save(
        (err, list) => {
            if(list) {
                return res.status(201).send(list);
           } else {
                console.log(err);
                return res.status(500).send('Oh no!');
           }
       }
    );
})

router.put('/api/list/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const listData: IList = {...req.body, owner: req.headers.authorization  };

    List.replaceOne({
         _id: id,
         owner: req.headers.authorization 
    }, listData)
        .then((response)=> {
            if (response.ok) {
                List.findById(id)
                    .populate('tasks')
                    .then((updatedList) => {
                        console.log(updatedList);
                        return res.status(201).send(updatedList);
                    })
            } else {
                return res.status(404).send('Not found');
            }
        })
})

router.put('/api/list/share/:id/:user', (req: Request, res: Response) => {
    const id = req.params.id;
    const userNameToShareWith:string = req.params.user;

    User.findOne({
        login : userNameToShareWith
    }).then((userResponse)=> {
        if(userResponse) {
            // user found, do the update
            List.findOneAndUpdate({
                _id: id,
                owner: req.headers.authorization 
            }, {
                $push : {sharedWith: userResponse._id}
            }).then((listResponse)=> {
                if (listResponse) {
                    return res.status(201).send('All done');
                } else {
                    return res.status(404).send('Not found');
                }
            })
        } else {
            return res.status(404).send('User not found, please check your typing');
        }
    })

})

router.delete('/api/list/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    List.findOneAndDelete({
        _id: id,
        owner: req.headers.authorization
    })
        .then( (foundRecord) => {
            if (foundRecord) {
                return res.status(201).send();
            } else {
                return res.status(404).send('Not found');
            }
        })
})

export { router as listRouter }
