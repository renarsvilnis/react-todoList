import express, {Request, Response} from 'express';
import path from 'path';

const router = express.Router();

router.use(express.static(path.join(__dirname,'../../build', )));
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

export { router as staticRouter }
