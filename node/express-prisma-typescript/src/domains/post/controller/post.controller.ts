import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db, BodyValidation } from '@utils'

import { PostRepositoryImpl } from '../repository'
import { PostService, PostServiceImpl } from '../service'
import { CreatePostInputDTO } from '../dto'
import { UserServiceImpl } from '@domains/user/service'
export const postRouter = Router()

// Use dependency injection
const postService: PostService = new PostServiceImpl(new PostRepositoryImpl(db), new UserServiceImpl())

//Get upload images url
postRouter.get('/upload-images-url', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const {fileName, url} = await postService.getUploadImageUrl(userId)
  return res.status(HttpStatus.OK).json({fileName, url})
})

//Comment in post
postRouter.post('/comment/:postId', BodyValidation(CreatePostInputDTO), async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params
  const content = req.body

  const comment = await postService.createComment(userId, postId, content)

  return res.status(HttpStatus.OK).json(comment)
})

//Get comments in a post
postRouter.get('/comments/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params
  const { limit, before, after } = req.query as Record<string, string>

  const comments = await postService.getCommentsFromPost(userId, postId, { limit: Number(limit), before, after })
  return res.status(HttpStatus.OK).json(comments)
})

//Get Latest Posts
postRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { limit, before, after } = req.query as Record<string, string>
  const posts = await postService.getLatestPosts(userId, { limit: Number(limit), before, after })

  return res.status(HttpStatus.OK).json(posts)
})

//Get post by postId
postRouter.get('/:postId', async (req: Request, res: Response) => {

  const { userId } = res.locals.context
  const { postId } = req.params

  const post = await postService.getPost(userId, postId)

  return res.status(HttpStatus.OK).json(post)
})

//Get posts by userId
postRouter.get('/by_user/:userId', async (req: Request, res: Response) => {

  const { userId } = res.locals.context
  const { limit, before, after } = req.query as Record<string, string>
  const { userId: authorId } = req.params

  const posts = await postService.getPostsByAuthor(userId, authorId, { limit: Number(limit), before, after })

  return res.status(HttpStatus.OK).json(posts)
})

//Create a new post
postRouter.post('/', BodyValidation(CreatePostInputDTO), async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const data = req.body
  
  const post = await postService.createPost(userId, data)

  return res.status(HttpStatus.CREATED).json(post)
})


//Delete a post by post Id
postRouter.delete('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params

  await postService.deletePost(userId, postId)

  return res.status(HttpStatus.OK).send(`Deleted post ${postId}`)
})

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePostInputDTO:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           description: Content of the post
 *         images:
 *           type: string
 *           description: (Optional) Images path on AWS S3 bucket
 *       required:
 *         - content
 */

/**
 * @swagger
 * /post:
 *   post:
 *     summary: Create a new post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostInputDTO'
 *       security:
 *         - BearerAuth: []
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the post
 *                 content:
 *                   type: string
 *                   description: The content of the post
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: uri
 *                   description: Array of image URLs associated with the post
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the post was created
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the post was last updated
 *       400:
 *         description: Bad request, e.g., invalid input data
 *       401:
 *         description: Unauthorized. Must login to access
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /post/upload-images-url:
 *   get:
 *     summary: Get upload URL for images
 *     tags: [Post]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the upload URL
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized. Must login to access
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /post/comment/{postId}:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostInputDTO'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully added the comment
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized. Must login to access
 *       404:
 *         description: Post not found or not following private account
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /post/comments/{postId}:
 *   get:
 *     summary: Get comments for a post
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to get comments for
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved comments
 *       401:
 *         description: Unauthorized. Must login to access
 *       404:
 *         description: Post not found or not following private account
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /post/:
 *   get:
 *     summary: Get the latest posts
 *     tags: [Post]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: before
 *         schema:
 *           type: string
 *       - in: query
 *         name: after
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the latest posts
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized. Must login to access
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /post/{postId}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to retrieve
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the post
 *       401:
 *         description: Unauthorized. Must login to access
 *       404:
 *         description: Post not found or not following private account
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /posts/by_user/{userId}:
 *   get:
 *     summary: Get posts by user ID
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user whose posts to retrieve
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *       - in: query
 *         name: before
 *         schema:
 *           type: string
 *         required: false
 *       - in: query
 *         name: after
 *         schema:
 *           type: string
 *         required: false
 *     responses:
 *       200:
 *         description: A list of posts by the specified user
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized. Must login to access
 *       404:
 *         description: User not found or not following private account
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /post/{postId}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to delete
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully deleted the post
 *       401:
 *         description: Unauthorized. Must login to access
 *       404:
 *         description: Post not found or not following private account
 */