import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { ReactionService } from '../services/reaction.service'
import { ReactionServiceImpl } from '../services/reaction.service.impl'

export const reactionRouter = Router()

const reactionService : ReactionService = new ReactionServiceImpl()

reactionRouter.post('/:post_id', async (req: Request, res: Response) => {
  const { userId } = res.locals.context 
  const { postId } = req.params
  const { reactionType } = req.body
  
  const reaction = await reactionService.createReaction(reactionType, userId, postId)
  return res.status(HttpStatus.OK).json(reaction)

})

reactionRouter.delete('/:post_id', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params
  const { reactionType } = req.body

  await reactionService.deleteReaction(reactionType, userId, postId)
  return res.status(HttpStatus.NO_CONTENT)
})

reactionRouter.get('/:user_id', async (req: Request, res: Response) => {
  const { userId } = res.locals.context 
  const { authorId } = req.params
  const { reactionType } = req.body
  //TO DO: Get reactions from user 
  return res.status(HttpStatus.OK).json()

})

/*
postRouter.get('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params

  const post = await postService.getPost(userId, postId)

  const visible = await postService.canAccessUsersPosts(userId, post.authorId)
  if (!visible) throw new NotFoundException('Post')

  return res.status(HttpStatus.OK).json(post)
})



const service: UserService = new UserServiceImpl(new UserRepositoryImpl(db))

postRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { limit, before, after } = req.query as Record<string, string>

  const posts = await postService.getLatestPosts(userId, { limit: Number(limit), before, after })

  return res.status(HttpStatus.OK).json(posts)
})
  */
