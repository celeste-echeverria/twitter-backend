import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'

//import 'express-async-errors'

import { db } from '@utils'

import { FollowRepositoryImpl } from '../repository'
import { FollowService, FollowServiceImpl } from '../service'

export const followerRouter = Router();

// Use dependency injection
const service: FollowService = new FollowServiceImpl(new FollowRepositoryImpl(db))

followerRouter.post('/follow/:userId', async (req: Request, res: Response) => {
    return res.status(HttpStatus.OK)
})

followerRouter.post('/unfollow/:userId', async (req: Request, res: Response) => {
    return res.status(HttpStatus.OK)
})