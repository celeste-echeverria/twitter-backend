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

  const user = await service.getUserView(userId, userId)
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
  const { userId } = res.locals.context
  const {userview, following} = await service.getUserView(userId, otherUserId)

  return res.status(HttpStatus.OK).json({userview, following})
})

userRouter.delete('/del', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  await service.deleteUser(userId)

  return res.status(HttpStatus.OK)
})

userRouter.get('/by_username/:username', async (req: Request, res: Response) => {
  const { limit, skip } = req.query as Record<string, string>
  const { username } = req.params
  const users = await service.getUsersMatchingUsername(username, { limit: Number(limit), skip: Number(skip) })
  return res.status(HttpStatus.OK).json(users)
})

/**
 * @swagger
 * components:
 *   schemas:
 *     UserDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the user
 *         name:
 *           type: string
 *           nullable: true
 *           description: The name of the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the user was created
 *         accTypeId:
 *           type: string
 *           description: The identifier of the account type
 *         accTypeName:
 *           type: string
 *           nullable: true
 *           description: The name of the account type
 *         profilePicture:
 *           type: string
 *           nullable: true
 *           description: The path of the user's profile picture on AWS S3 bucket
 *     ExtendedUserDTO:
 *       allOf:
 *         - $ref: '#/components/schemas/UserDTO'
 *         - type: object
 *           properties:
 *             email:
 *               type: string
 *               description: The email address of the user
 *             username:
 *               type: string
 *               description: The username of the user
 *             password:
 *               type: string
 *               description: The password of the user
 *     UserViewDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the user
 *         name:
 *           type: string
 *           nullable: true
 *           description: The name of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         profilePicture:
 *           type: string
 *           nullable: true
 *           description: The path of the user's profile picture on AWS S3 bucket
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
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user recommendations
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized. Must login to access
 *       500:
 *         description: Internal server error
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
 *       401:
 *         description: Unauthorized. Must login to access
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
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
 *       401:
 *         description: Unauthorized. Must login to access
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
 *       401:
 *         description: Unauthorized. Must login to access
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
 *       401:
 *         description: Unauthorized. Must login to access
 *       404:
 *         description: User not found or cannot access
 *       500:
 *         description: Internal server error
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
 *       401:
 *         description: Unauthorized. Must login to access
 *       404:
 *         description: User not found or cannot access
 */

/**
 * @swagger
 * /user/by_username/{username}:
 *   get:
 *     summary: Get users matching the given username
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: The username to search for
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           required: false
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           required: false
 *     responses:
 *       200:
 *         description: A list of users matching the username
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized. Must login to access
 *       404:
 *         description: Not found or cannot access
 *       500:
 *         description: Internal server error
 */