import { Request, Response } from 'express';
import {
  createSchemaType,
  updateSchemaType,
  deleteSchemaType,
  getAllSchemaType,
  getSchemaType,
} from './artist.schema';
import db from '../../services/db.service';
import { Artist, Prisma } from '@prisma/client';
import { addChangeLogEntry } from '../changeLog/changeLog.service';

const createController = async (req: Request, res: Response) => {
  const body = req.body as createSchemaType['body'];
  const result = await db.artist.create({
    data: {
      name: body.name,
      bio: body.bio,
      imageUrl: body.imageUrl,
    },
  });

  addChangeLogEntry({
    keys: ['name', 'bio', 'imageUrl'],
    module: 'artist',
    title: `'${result.name}' Artist Created`,
    newValue: result,
    referenceId: result.id,
  });

  res.status(201).json({ success: true, data: result });
};

const updateController = async (req: Request, res: Response) => {
  const params = req.params as updateSchemaType['params'];
  const body = req.body as updateSchemaType['body'];

  const findResult = await db.artist.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!findResult) throw new AppError('record not found', { status: 404 });

  const updateValues: Partial<Artist> = {};
  const changeLogKeys: string[] = [];

  if (body.name !== findResult.name) {
    updateValues['name'] = body.name;
    changeLogKeys.push('name');
  }
  if (body.bio !== findResult.bio) {
    updateValues['bio'] = body.bio;
    changeLogKeys.push('bio');
  }
  if (body.imageUrl !== findResult.imageUrl) {
    updateValues['imageUrl'] = body.imageUrl;
    changeLogKeys.push('imageUrl');
  }

  const updatedResult = await db.artist.update({
    where: {
      id: params.id,
    },
    data: updateValues,
  });

  addChangeLogEntry({
    keys: changeLogKeys,
    module: 'artist',
    title: `'${updatedResult.name}' Artist Updated`,
    newValue: updatedResult,
    oldValue: findResult,
    referenceId: updatedResult.id,
  });

  res.status(200).json({ success: true, data: updatedResult });
};

const deleteController = async (req: Request, res: Response) => {
  const params = req.params as deleteSchemaType['params'];

  const findResult = await db.artist.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!findResult) throw new AppError('record not found', { status: 404 });

  const result = await db.artist.delete({
    where: {
      id: params.id,
    },
  });

  addChangeLogEntry({
    keys: ['name', 'bio', 'imageUrl'],
    module: 'artist',
    title: `'${result.name}' Artist Deleted`,
    newValue: result,
    referenceId: result.id,
  });

  res.status(200).json({ success: true, data: result });
};

const getController = async (req: Request, res: Response) => {
  const params = req.params as getSchemaType['params'];
  const result = await db.artist.findUnique({
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

  console.log('req.query', req.query.sort);
  console.dir(req.query.sort, { depth: null });



  const filter: Prisma.ArtistWhereInput = {};
  let orderBy: Prisma.ArtistOrderByWithRelationInput | undefined = undefined;

  switch (query.orderBy) {
    default:
      orderBy = {
        [query.orderBy]: query.order,
      };
      break;
  }

  const result = await db.artist.findMany({
    where: filter,
    skip: page > 0 ? skip : undefined,
    take: page > 0 ? limit : undefined,
    orderBy: orderBy,
  });

  const total = await db.artist.count({ where: filter });

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
