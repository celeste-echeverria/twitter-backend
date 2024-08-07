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
    const { userId: followedId } = req.params

    await service.follow(followerId, followedId)

    return res.status(HttpStatus.OK).send(`Followed user ${followedId}`)
})

followRouter.post('/unfollow/:userId', async (req: Request, res: Response) => {
    const { userId: followerId } = res.locals.context
    const { userId: followedId } = req.params

    await service.unfollow(followerId, followedId)

    return res.status(HttpStatus.OK).send(`Unfollowed user ${followedId}`)
})

followRouter.get('/followers', async (req: Request, res: Response) => {
    const { userId } = res.locals.context

    const followers = await service.getFollowersByUserId(userId)

    return res.status(HttpStatus.OK).send(followers)
})

followRouter.get('/following', async (req: Request, res: Response) => {
    const { userId } = res.locals.context

    const following = await service.getFollowingByUserId(userId)

    return res.status(HttpStatus.OK).send(following)
})

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     UserId:
 *       type: string
 *       description: The ID of the user
 */

/**
 * @swagger
 * /follower/follow/{userId}:
 *   post:
 *     summary: Follow a user
 *     tags: [Follow]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to follow
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully followed the user
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized. Must login to access
 *       409:
 *         description: Conflict. Already following user
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /follower/unfollow/{userId}:
 *   post:
 *     summary: Unfollow a user
 *     tags: [Follow]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to unfollow
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully unfollowed the user
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized. Must login to access
 *       409:
 *         description: Conflict. Not following user
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /follower/followers:
 *   get:
 *     summary: Get the list of followers for the current user
 *     tags: [Follow]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of followers
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized. Must login to access
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /follower/following:
 *   get:
 *     summary: Get the list of users the current user is following
 *     tags: [Follow]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of users being followed
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized. Must login to access
 *       500:
 *         description: Internal server error
 */
