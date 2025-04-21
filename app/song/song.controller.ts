import { Request, Response } from 'express';
import {
  createSchemaType,
  updateSchemaType,
  deleteSchemaType,
  getAllSchemaType,
  getSchemaType,
} from './song.schema';
import db from '../../services/db.services';
import { Prisma, Song } from '../../prisma-client';
import { addChangeLogEntry } from '../changeLog/changeLog.service';

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

  addChangeLogEntry({
    keys: ['title', 'duration', 'audioUrl', 'trackNumber'],
    module: 'song',
    title: `'${result.title}' Song Created`,
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

  const findResult = await db.song.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!findResult) throw new AppError('record not found', { status: 404 });

  const updateValues: Partial<Song> = {};
  const changeLogKeys: string[] = [];

  if (body.albumId !== findResult.albumId) {
    updateValues['albumId'] = body.albumId;
    changeLogKeys.push('albumId');
  }
  if (body.artistId !== findResult.artistId) {
    updateValues['artistId'] = body.artistId;
    changeLogKeys.push('artistId');
  }
  if (body.audioUrl !== findResult.audioUrl) {
    updateValues['audioUrl'] = body.audioUrl;
    changeLogKeys.push('audioUrl');
  }
  if (body.duration !== findResult.duration) {
    updateValues['duration'] = body.duration;
    changeLogKeys.push('duration');
  }
  if (body.genreId !== findResult.genreId) {
    updateValues['genreId'] = body.genreId;
    changeLogKeys.push('genreId');
  }
  if (body.title !== findResult.title) {
    updateValues['title'] = body.title;
    changeLogKeys.push('title');
  }
  if (body.trackNumber !== findResult.trackNumber) {
    updateValues['trackNumber'] = body.trackNumber;
    changeLogKeys.push('trackNumber');
  }

  if (Object.keys(updateValues).length === 0)
    throw new AppError('no data to update', { status: 400 });

  const updatedResult = await db.song.update({
    where: {
      id: params.id,
    },
    data: updateValues,
  });

  addChangeLogEntry({
    keys: changeLogKeys,
    module: 'song',
    title: `'${updatedResult.title}' Song Updated`,
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

  const findResult = await db.song.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!findResult) throw new AppError('record not found', { status: 404 });

  const deletedResult = await db.song.delete({
    where: {
      id: params.id,
    },
  });

  addChangeLogEntry({
    keys: ['title', 'duration', 'audioUrl', 'trackNumber'],
    module: 'song',
    title: `'${deletedResult.title}' Song Deleted`,
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
  const result = await db.song.findUnique({
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

  const filter: Prisma.SongWhereInput = {};
  let orderBy: Prisma.SongOrderByWithRelationInput[] | undefined = undefined;

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

  const result = await db.song.findMany({
    where: filter,
    skip: page > 0 ? skip : undefined,
    take: page > 0 ? limit : undefined,
    orderBy: orderBy,
  });

  const total = await db.song.count({ where: filter });

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
