import { Prisma, User } from '@prisma/client';

import { db } from '../../services/db.service';
import { BasicUser } from '../../type/BasicUser.type';

const getUser = async (id: string): Promise<BasicUser | null> => {
  try {
    const queryResult = await db.user.findUnique({
      where: { id: id },
      omit: { password: true },
    });

    return queryResult;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const createUser = async (
  data: Prisma.UserCreateInput,
): Promise<BasicUser | null> => {
  try {
    const userReturn = await db.user.create({
      data: data,
      omit: { password: true },
    });

    return userReturn;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const updateUser = async (
  id: string,
  data: Prisma.UserUpdateInput,
): Promise<BasicUser | null> => {
  try {
    const userReturn = await db.user.update({
      where: { id: id },
      data: data,
      omit: { password: true },
    });

    return userReturn;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// const deleteUser = async (id: string): Promise<BasicUser | null> => {
//   try {
//     const userReturn = await db.user.delete({
//       where: { id: id },
//     });

//     return userReturn;
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// };

const userService = {
  getUser,
  createUser,
  updateUser,
  // deleteUser,
};

export default userService;
