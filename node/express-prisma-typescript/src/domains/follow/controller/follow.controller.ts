import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'

import 'express-async-errors'

import { db } from '@utils'

import { FollowRepositoryImpl } from '../repository'
import { FollowService, FollowServiceImpl } from '../service'

export const userRouter = Router();

// Use dependency injection
const service: FollowService = new FollowServiceImpl(new FollowRepositoryImpl(db))

userRouter.get('/', async (req: Request, res: Response) => {
  
})