import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db, BodyValidation, NotFoundException } from '@utils'

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
 *       required:
 *         - content
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fileName:
 *                   type: string
 *                   description: The name of the file
 *                 url:
 *                   type: string
 *                   description: The pre-signed URL for uploading the image
 *       400:
 *         description: Invalid request
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the comment
 *                 content:
 *                   type: string
 *                   description: Content of the comment
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Post not found
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the comment
 *                   content:
 *                     type: string
 *                     description: Content of the comment
 *       404:
 *         description: Post not found
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
 *         description: Number of posts to return
 *       - in: query
 *         name: before
 *         schema:
 *           type: string
 *         description: Fetch posts before this timestamp
 *       - in: query
 *         name: after
 *         schema:
 *           type: string
 *         description: Fetch posts after this timestamp
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the latest posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the post
 *                   content:
 *                     type: string
 *                     description: Content of the post
 *       400:
 *         description: Invalid request
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the post
 *                 content:
 *                   type: string
 *                   description: Content of the post
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /post/by_user/{userId}:
 *   get:
 *     summary: Get posts by a specific user
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user whose posts to retrieve
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved posts by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the post
 *                   content:
 *                     type: string
 *                     description: Content of the post
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /post/:
 *   post:
 *     summary: Create a new post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostInputDTO'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Successfully created the post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the created post
 *                 content:
 *                   type: string
 *                   description: Content of the created post
 *       400:
 *         description: Invalid input data
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
 *       404:
 *         description: Post not found
 */