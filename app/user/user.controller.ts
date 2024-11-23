import { Request, Response } from 'express';
import userService from './user.service';
import { updateUserSchemaType } from './user.schema';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';

// GET /user
const getUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) return;
    const data = await userService.getUser(req.user.id);

    if (!data) throw new Error('User not found');

    res.status(200).json({ success: true, data: data });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// PUT /user
const updateUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) return;

    const payload = req.body as updateUserSchemaType['body'];

    const updateObj: Prisma.UserUpdateInput = {};
    if (
      payload.email &&
      payload.email.trim().toLowerCase() !== req.user.email.toLowerCase()
    ) {
      // TODO check email valid
      updateObj.email = payload.email;
    }
    if (payload.password) {
      const hash = await argon2.hash(payload.password);
      updateObj.password = hash;
    }
    if (payload.firstName && payload.firstName.trim() !== req.user.firstName)
      updateObj.firstName = payload.firstName;

    if (payload.lastName && payload.lastName.trim() !== req.user.lastName)
      updateObj.lastName = payload.lastName;

    if (
      payload.profileImage &&
      payload.profileImage.trim() !== req.user.profileImage
    )
      updateObj.profileImage = payload.profileImage;

    if (payload.country && payload.country !== req.user.country)
      updateObj.country = payload.country;

    if (payload.state && payload.state.trim() !== req.user.state)
      updateObj.state = payload.state;

    const data = await userService.updateUser(req.user.id, updateObj);

    if (!data) throw new Error('update failed');

    res.status(200).json({ data: data, success: true });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ success: false, error: err.message });
  }
};

const userController = {
  getUser,
  updateUser,
};

export default userController;
