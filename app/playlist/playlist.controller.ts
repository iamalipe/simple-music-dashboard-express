import { Request, Response } from 'express';
import {
  createSchemaType,
  updateSchemaType,
  deleteSchemaType,
  getAllSchemaType,
  getSchemaType,
} from './playlist.schema';
import db from '../../services/db.services';
import { Prisma, Playlist } from '../../prisma-client';
import { addChangeLogEntry } from '../changeLog/changeLog.service';

const createController = async (req: Request, res: Response) => {
  const body = req.body as createSchemaType['body'];
  const result = await db.playlist.create({
    data: {
      name: body.name,
      description: body.description,
      songIDs: body.songIDs,
    },
  });

  addChangeLogEntry({
    keys: ['name', 'description'],
    module: 'playlist',
    title: `'${result.name}' Playlist Created`,
    newValue: result,
    referenceId: result.id,
  });

  res.status(201).json({
    success: true,
    data: result,
    errors: [],
    timestamp: new Date().toISOString(),
    message: 'success',
  });
};

const updateController = async (req: Request, res: Response) => {
  const params = req.params as updateSchemaType['params'];
  const body = req.body as updateSchemaType['body'];

  const findResult = await db.playlist.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!findResult) throw new AppError('record not found', { status: 404 });

  const updateValues: Partial<Playlist> = {};
  const changeLogKeys: string[] = [];

  if (body.name !== findResult.name) {
    updateValues['name'] = body.name;
    changeLogKeys.push('name');
  }
  if (body.description !== findResult.description) {
    updateValues['description'] = body.description;
    changeLogKeys.push('description');
  }
  // if (body.songIDs !== findResult.songIDs) {
  if (body.songIDs) {
    updateValues['songIDs'] = body.songIDs;
    changeLogKeys.push('songIDs');
  }

  if (Object.keys(updateValues).length === 0)
    throw new AppError('no data to update', { status: 400 });

  const updatedResult = await db.playlist.update({
    where: {
      id: params.id,
    },
    data: updateValues,
  });

  addChangeLogEntry({
    keys: changeLogKeys,
    module: 'playlist',
    title: `'${updatedResult.name}' Playlist Updated`,
    newValue: updatedResult,
    oldValue: findResult,
    referenceId: updatedResult.id,
  });

  res.status(200).json({
    success: true,
    data: updatedResult,
    errors: [],
    timestamp: new Date().toISOString(),
    message: 'success',
  });
};

const deleteController = async (req: Request, res: Response) => {
  const params = req.params as deleteSchemaType['params'];

  const findResult = await db.playlist.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!findResult) throw new AppError('record not found', { status: 404 });

  const deletedResult = await db.playlist.delete({
    where: {
      id: params.id,
    },
  });

  addChangeLogEntry({
    keys: ['name', 'description'],
    module: 'playlist',
    title: `'${deletedResult.name}' Playlist Deleted`,
    newValue: deletedResult,
    referenceId: deletedResult.id,
  });

  res.status(200).json({
    success: true,
    data: deletedResult,
    errors: [],
    timestamp: new Date().toISOString(),
    message: 'success',
  });
};

const getController = async (req: Request, res: Response) => {
  const params = req.params as getSchemaType['params'];
  const result = await db.playlist.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!result) throw new AppError('record not found', { status: 404 });

  res.status(200).json({
    success: true,
    data: result,
    errors: [],
    timestamp: new Date().toISOString(),
    message: 'success',
  });
};

const getAllController = async (req: Request, res: Response) => {
  const query = req.query as unknown as getAllSchemaType['query'];
  const limit = parseInt(query.limit as unknown as string, 10);
  const page = parseInt(query.page as unknown as string, 10);
  const skip = (page - 1) * limit;

  const filter: Prisma.PlaylistWhereInput = {};
  let orderBy: Prisma.PlaylistOrderByWithRelationInput[] | undefined =
    undefined;

  if (query.sort.length > 0) {
    orderBy = query.sort.map((sort) => {
      switch (sort.orderBy) {
        default:
          return {
            [sort.orderBy]: sort.order,
          };
      }
    });
  }

  const result = await db.playlist.findMany({
    where: filter,
    skip: page > 0 ? skip : undefined,
    take: page > 0 ? limit : undefined,
    orderBy: orderBy,
  });

  const total = await db.playlist.count({ where: filter });

  const sort = query.sort;

  const pagination = {
    page,
    limit,
    total,
    current: result.length,
  };

  res.status(200).json({
    success: true,
    data: result,
    sort,
    pagination,
    errors: [],
    timestamp: new Date().toISOString(),
    message: 'success',
  });
};

export default {
  createController,
  updateController,
  deleteController,
  getController,
  getAllController,
};
