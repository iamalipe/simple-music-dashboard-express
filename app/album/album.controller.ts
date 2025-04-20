import { Request, Response } from 'express';
import {
  createSchemaType,
  updateSchemaType,
  deleteSchemaType,
  getAllSchemaType,
  getSchemaType,
} from './album.schema';
import db from '../../services/db.services';
import { Prisma } from '../../prisma-client';
import dayjs from 'dayjs';
import { addChangeLogEntry } from '../changeLog/changeLog.service';

const createController = async (req: Request, res: Response) => {
  const body = req.body as createSchemaType['body'];
  const result = await db.album.create({
    data: {
      title: body.title,
      coverUrl: body.coverUrl,
      artistId: body.artistId,
      releaseDate: body.releaseDate,
    },
    include: {
      artist: true,
    },
  });

  addChangeLogEntry({
    keys: ['title', 'coverUrl', 'artist.name', 'releaseDate'],
    module: 'album',
    title: `'${result.title}' Album Created`,
    newValue: result,
    referenceId: result.id,
  });

  res.status(201).json({ success: true, data: result });
};

const updateController = async (req: Request, res: Response) => {
  const params = req.params as updateSchemaType['params'];
  const body = req.body as updateSchemaType['body'];

  const findResult = await db.album.findUnique({
    where: {
      id: params.id,
    },
    include: {
      artist: true,
    },
  });

  if (!findResult) throw new AppError('record not found', { status: 404 });

  const updateValues: { [key: string]: any } = {};
  const changeLogKeys: string[] = [];

  if (body.title !== findResult.title) {
    updateValues['title'] = body.title;
    changeLogKeys.push('title');
  }

  if (body.coverUrl !== findResult.coverUrl) {
    updateValues['coverUrl'] = body.coverUrl;
    changeLogKeys.push('coverUrl');
  }

  if (body.artistId !== findResult.artistId) {
    updateValues['artistId'] = body.artistId;
    changeLogKeys.push('artist.name');
  }

  if (
    body.releaseDate &&
    dayjs(body.releaseDate).isSame(dayjs(findResult.releaseDate), 'day')
  ) {
    updateValues['releaseDate'] = body.releaseDate;
    changeLogKeys.push('releaseDate');
  }

  const updatedResult = await db.album.update({
    where: {
      id: params.id,
    },
    data: updateValues,
    include: {
      artist: true,
    },
  });

  addChangeLogEntry({
    keys: changeLogKeys,
    module: 'album',
    title: `'${updatedResult.title}' Album Updated`,
    newValue: updatedResult,
    oldValue: findResult,
    referenceId: updatedResult.id,
  });

  res.status(200).json({ success: true, data: updatedResult });
};

const deleteController = async (req: Request, res: Response) => {
  const params = req.params as deleteSchemaType['params'];

  const findResult = await db.album.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!findResult) throw new AppError('record not found', { status: 404 });

  const deletedResult = await db.album.delete({
    where: {
      id: params.id,
    },
    include: {
      artist: true,
    },
  });

  addChangeLogEntry({
    keys: ['title', 'coverUrl', 'artist.name', 'releaseDate'],
    module: 'album',
    title: `'${deletedResult.title}' Album Deleted`,
    oldValue: deletedResult,
    referenceId: deletedResult.id,
  });

  res.status(200).json({ success: true, data: deletedResult });
};

const getController = async (req: Request, res: Response) => {
  const params = req.params as getSchemaType['params'];
  const result = await db.album.findUnique({
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

  const filter: Prisma.AlbumWhereInput = {};
  let orderBy: Prisma.AlbumOrderByWithRelationInput | undefined = undefined;

  switch (query.orderBy) {
    default:
      orderBy = {
        [query.orderBy]: query.order,
      };
      break;
  }

  const result = await db.album.findMany({
    where: filter,
    skip: page > 0 ? skip : undefined,
    take: page > 0 ? limit : undefined,
    orderBy: orderBy,
  });

  const total = await db.album.count({ where: filter });

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
