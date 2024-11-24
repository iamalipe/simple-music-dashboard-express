import { Request, Response } from 'express';
import {
  createSchemaType,
  updateSchemaType,
  deleteSchemaType,
  getAllSchemaType,
  getSchemaType,
} from './genre.schema';
import db from '../../services/db.service';

const createController = async (req: Request, res: Response) => {
  const body = req.body as createSchemaType['body'];
  const result = await db.genre.create({
    data: {
      name: body.name,
    },
  });

  res.status(201).json({ success: true, data: result });
};

const updateController = async (req: Request, res: Response) => {
  const params = req.params as updateSchemaType['params'];
  const body = req.body as updateSchemaType['body'];

  const findResult = await db.genre.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!findResult) throw new AppError('record not found', { status: 404 });

  const result = await db.genre.update({
    where: {
      id: params.id,
    },
    data: {
      name: body.name,
    },
  });

  res.status(200).json({ success: true, data: result });
};

const deleteController = async (req: Request, res: Response) => {
  const params = req.params as deleteSchemaType['params'];

  const findResult = await db.genre.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!findResult) throw new AppError('record not found', { status: 404 });

  const result = await db.genre.delete({
    where: {
      id: params.id,
    },
  });

  res.status(200).json({ success: true, data: result });
};

const getController = async (req: Request, res: Response) => {
  const params = req.params as getSchemaType['params'];
  const result = await db.genre.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!result) throw new AppError('record not found', { status: 404 });

  res.status(200).json({ success: true, data: result });
};

const getAllController = async (req: Request, res: Response) => {
  const query = req.query as unknown as getAllSchemaType['query'];
  const limit = parseInt(query.limit as unknown as string, 10);
  const page = parseInt(query.page as unknown as string, 10);
  const skip = (page - 1) * limit;

  const result = await db.genre.findMany({
    skip,
    take: limit,
  });

  res.status(200).json({ success: true, data: result });
};

export default {
  createController,
  updateController,
  deleteController,
  getController,
  getAllController,
};
