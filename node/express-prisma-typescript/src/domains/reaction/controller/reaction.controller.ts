import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { ReactionService } from '../services/reaction.service'
import { ReactionServiceImpl } from '../services/reaction.service.impl'

export const reactionRouter = Router()

const reactionService : ReactionService = new ReactionServiceImpl()

reactionRouter.post('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context 
  const { postId } = req.params
  const { reactionTypeName }  = req.body

  const reaction = await reactionService.createReaction(reactionTypeName, userId, postId)
  return res.status(HttpStatus.OK).json(reaction)
})

reactionRouter.delete('/:reactionId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { reactionId } = req.params

  await reactionService.deleteReaction(reactionId, userId)
  return res.status(HttpStatus.OK).send(`Deleted reaction ${reactionId}`)
})

reactionRouter.get('/:user_id', async (req: Request, res: Response) => {
  const { userId } = res.locals.context 
  const { authorId } = req.params
  const { reactionType } = req.body

  //TO DO: Get reactions from user 
  return res.status(HttpStatus.OK).json()

})

