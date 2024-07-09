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

//Comment in post
postRouter.post('/comment/:postId', BodyValidation(CreatePostInputDTO), async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params
  const { data } = req.body

  const comment = await postService.createComment(userId, postId, data)

  return res.status(HttpStatus.OK).json(comment)
})

//Get comments in a post
postRouter.get('/comments/:postId'), async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params

  const comments = await postService.getCommentsFromPost(userId, postId)
  return res.status(HttpStatus.OK).json(comments)
}

postRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { limit, before, after } = req.query as Record<string, string>

  const posts = await postService.getLatestPosts(userId, { limit: Number(limit), before, after })

  return res.status(HttpStatus.OK).json(posts)
})

postRouter.get('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params

  const post = await postService.getPost(userId, postId)

  return res.status(HttpStatus.OK).json(post)
})

postRouter.get('/by_user/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { userId: authorId } = req.params

  const posts = await postService.getPostsByAuthor(userId, authorId)

  return res.status(HttpStatus.OK).json(posts)
})

postRouter.post('/', BodyValidation(CreatePostInputDTO), async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const data = req.body

  const post = await postService.createPost(userId, data)

  return res.status(HttpStatus.CREATED).json(post)
})

postRouter.delete('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params

  await postService.deletePost(userId, postId)

  return res.status(HttpStatus.OK).send(`Deleted post ${postId}`)
})
