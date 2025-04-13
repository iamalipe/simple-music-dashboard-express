import { Request, Response } from 'express';
import {
  createSchemaType,
  updateSchemaType,
  deleteSchemaType,
  getAllSchemaType,
  getSchemaType,
} from './song.schema';
import db from '../../services/db.services';
import { Prisma } from '@prisma/client';

const createController = async (req: Request, res: Response) => {
  const body = req.body as createSchemaType['body'];
  const result = await db.song.create({
    data: {
      title: body.title,
      artistId: body.artistId,
      albumId: body.albumId,
      genreId: body.genreId,
      duration: body.duration,
      audioUrl: body.audioUrl,
      trackNumber: body.trackNumber,
    },
  });

  res.status(201).json({ success: true, data: result });
};

const updateController = async (req: Request, res: Response) => {
  const params = req.params as updateSchemaType['params'];
  const body = req.body as updateSchemaType['body'];

  const findResult = await db.song.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!findResult) throw new AppError('record not found', { status: 404 });

  const result = await db.song.update({
    where: {
      id: params.id,
    },
    data: {
      title: body.title,
      artistId: body.artistId,
      albumId: body.albumId,
      genreId: body.genreId,
      duration: body.duration,
      audioUrl: body.audioUrl,
      trackNumber: body.trackNumber,
    },
  });

  res.status(200).json({ success: true, data: result });
};

const deleteController = async (req: Request, res: Response) => {
  const params = req.params as deleteSchemaType['params'];

  const findResult = await db.song.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!findResult) throw new AppError('record not found', { status: 404 });

  const result = await db.song.delete({
    where: {
      id: params.id,
    },
  });

  res.status(200).json({ success: true, data: result });
};

const getController = async (req: Request, res: Response) => {
  const params = req.params as getSchemaType['params'];
  const result = await db.song.findUnique({
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

  const filter: Prisma.SongWhereInput = {};
  let orderBy: Prisma.SongOrderByWithRelationInput | undefined = undefined;

  switch (query.orderBy) {
    default:
      orderBy = {
        [query.orderBy]: query.order,
      };
      break;
  }

  const result = await db.song.findMany({
    where: filter,
    skip: page > 0 ? skip : undefined,
    take: page > 0 ? limit : undefined,
    orderBy: orderBy,
  });

  const total = await db.song.count({ where: filter });

  const sort = {
    orderBy: query.orderBy,
    order: query.order,
  };

  const pagination = {
    page,
    limit,
    total,
    current: result.length,
  };

  res.status(200).json({ success: true, data: result, sort, pagination });
};

export default {
  createController,
  updateController,
  deleteController,
  getController,
  getAllController,
};
