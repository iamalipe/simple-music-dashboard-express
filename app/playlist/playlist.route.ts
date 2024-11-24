import express from 'express';
import controller from './playlist.controller';
import { validate } from '../../middlewares/validate.middleware';
import {
  createSchema,
  updateSchema,
  deleteSchema,
  getSchema,
  getAllSchema,
} from './playlist.schema';

const router = express.Router();
router.post('/', validate(createSchema), controller.createController);
router.put('/:id', validate(updateSchema), controller.updateController);
router.delete('/:id', validate(deleteSchema), controller.deleteController);
router.get('/:id', validate(getSchema), controller.getController);
router.get('/', validate(getAllSchema), controller.getAllController);

export default router;
