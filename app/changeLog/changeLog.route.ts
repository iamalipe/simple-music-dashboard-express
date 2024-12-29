import express from 'express';
import controller from './changeLog.controller';
import { validate } from '../../middlewares/validate.middleware';
import { getSchema, getAllSchema } from './changeLog.schema';

const router = express.Router();

router.get('/:id', validate(getSchema), controller.getController);
router.get('/', validate(getAllSchema), controller.getAllController);

export default router;
