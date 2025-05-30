import { deleteUserById, getUserById, getUsers, updateUserById } from "../store/services/user";
import express from 'express';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
    return;
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
    return;
  }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUserById(id);

    res.status(204).json(deletedUser);
    return;
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
    return;
  }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    if (!username) {
      res.sendStatus(400);
      return;
    }

    const user = await getUserById(id);

    if (!user) {
      res.sendStatus(404);
      return;
    }

    const updatedUser = await updateUserById(id, { username });

    res.status(200).json(updatedUser).end();
    return;
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}