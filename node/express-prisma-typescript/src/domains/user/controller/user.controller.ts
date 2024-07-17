import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db } from '@utils'

import { UserRepositoryImpl } from '../repository'
import { UserService, UserServiceImpl } from '../service'

export const userRouter = Router()

// Use dependency injection
const service: UserService = new UserServiceImpl(new UserRepositoryImpl(db))

userRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { limit, skip } = req.query as Record<string, string>
  const users = await service.getUserRecommendations(userId, { limit: Number(limit), skip: Number(skip) })

  return res.status(HttpStatus.OK).json(users)
})

userRouter.get('/me', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  const user = await service.getUser(userId)
  console.log(user.accTypeName)
  return res.status(HttpStatus.OK).json(user)
})

userRouter.get('/profile-upload-url', async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals.context;
    const url = await service.getProfileUploadUrl(userId);
    res.status(200).json({ url });
  } catch (error) {
    console.error('Error al obtener URL pre-firmada:', error);
    res.status(500).json({ message: 'Error al obtener URL pre-firmada' });
  }
});

userRouter.get('/profile-download-url', async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals.context;
    const url = await service.getProfileDownloadUrl(userId);
    res.status(200).json({ url });
  } catch (error) {
    console.error('Error al obtener URL pre-firmada:', error);
    res.status(500).json({ message: 'Error al obtener URL pre-firmada' });
  }
});

userRouter.get('/:userId', async (req: Request, res: Response) => {
  const { userId: otherUserId } = req.params
  const user = await service.getUser(otherUserId)

  return res.status(HttpStatus.OK).json(user)
})

userRouter.delete('/del', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  await service.deleteUser(userId)

  return res.status(HttpStatus.OK)
})



