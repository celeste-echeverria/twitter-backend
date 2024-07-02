import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'

import 'express-async-errors'

import { db } from '@utils'

import { FollowRepositoryImpl } from '../repository'
import { FollowService, FollowServiceImpl } from '../service'

export const followRouter = Router();

// Use dependency injection
const service: FollowService = new FollowServiceImpl(new FollowRepositoryImpl(db))

followRouter.post('/follow/:userId', async (req: Request, res: Response) => {
    const { userId: followerId } = res.locals.context
    const { followedId } = req.params

    await service.follow(followerId, followedId)

    return res.status(HttpStatus.OK).send(`Followed user ${followedId}`)
})

followRouter.post('/unfollow/:userId', async (req: Request, res: Response) => {
    const { userId: followerId } = res.locals.context
    const { followedId } = req.params

    await service.unfollow(followerId, followedId)

    return res.status(HttpStatus.OK).send(`Unfollowed user ${followedId}`)
})