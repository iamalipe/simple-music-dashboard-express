import { Genre } from '../../prisma-client';
import db from '../../services/db.services';

const recordCreate = async (data: Genre) => {
  const result = await db.genre.create({
    data: data,
  });
  return result;
};

const recordUpdate = async (id: string, data: Partial<Genre>) => {
  const updatedResult = await db.genre.update({
    where: {
      id: id,
    },
    data: data,
  });
  return updatedResult;
};

const recordDelete = async (id: string) => {
  const findResult = await db.genre.findUnique({
    where: {
      id: id,
    },
  });

  if (!findResult) throw new AppError('record not found', { status: 404 });

  const deletedResult = await db.genre.delete({
    where: {
      id: id,
    },
  });
  return deletedResult;
};

const recordGet = async (name: string) => {};

const recordGetByName = async (name: string) => {
  const uniqueCheck = await db.genre.findFirst({
    where: {
      name: {
        equals: name,
        mode: 'insensitive',
      },
    },
  });
  return uniqueCheck;
};

const recordGetAll = async (name: string) => {};
