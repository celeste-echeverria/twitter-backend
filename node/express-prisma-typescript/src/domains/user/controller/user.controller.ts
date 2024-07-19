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

  const user = await service.getUserView(userId)
  return res.status(HttpStatus.OK).json(user)
})

userRouter.get('/profile-upload-url', async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals.context
    const url  = await service.getProfileUploadUrl(userId)
    res.status(200).json({ url })
  } catch (error) {
    console.error('Error getting pre-signed URL:', error)
    res.status(500).json({ message: 'Error getting pre-signed URL' })
  }
});

userRouter.get('/profile-download-url', async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals.context
    const url = await service.getProfileDownloadUrl(userId)
    res.status(200).json({ url })
  } catch (error) {
    console.error('Error getting pre-signed URL', error)
    res.status(500).json({ message: 'Error getting pre-signed URL' })
  }
})

userRouter.get('/:userId', async (req: Request, res: Response) => {
  const { userId: otherUserId } = req.params
  const user = await service.getUserView(otherUserId)

  return res.status(HttpStatus.OK).json(user)
})

userRouter.delete('/del', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  await service.deleteUser(userId)

  return res.status(HttpStatus.OK)
})

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The user ID
 *         username:
 *           type: string
 *           description: The username of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         profileUrl:
 *           type: string
 *           description: The URL of the user's profile picture
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get user recommendations
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit the number of users returned
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *         description: Number of users to skip
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /user/profile-upload-url:
 *   get:
 *     summary: Get pre-signed URL for profile picture upload
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved pre-signed URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *       500:
 *         description: Error getting pre-signed URL
 */

/**
 * @swagger
 * /user/profile-download-url:
 *   get:
 *     summary: Get pre-signed URL for profile picture download
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved pre-signed URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *       500:
 *         description: Error getting pre-signed URL
 */

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to retrieve
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /user/del:
 *   delete:
 *     summary: Delete the current user
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully deleted the user
 *       404:
 *         description: User not found
 */