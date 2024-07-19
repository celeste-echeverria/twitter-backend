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

reactionRouter.get('/:authorId/:reactionTypeName', async (req: Request, res: Response) => {
  const { userId } = res.locals.context 
  const { authorId, reactionTypeName } = req.params

  //TO DO: Get reactions from user 
  const reactions = await reactionService.getUserLikesOrRetweets(authorId, reactionTypeName)
  return res.status(HttpStatus.OK).json(reactions)

})

/**
 * @swagger
 * components:
 *   schemas:
 *     Reaction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the reaction
 *         postId:
 *           type: string
 *           description: The ID of the post
 *         userId:
 *           type: string
 *           description: The ID of the user who reacted
 *         reactionTypeName:
 *           type: string
 *           description: The type of reaction (e.g., like, retweet)
 *       required:
 *         - postId
 *         - userId
 *         - reactionTypeName
 */

/**
 * @swagger
 * /reaction/{postId}:
 *   post:
 *     summary: Add a reaction to a post
 *     tags: [Reaction]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to react to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reactionTypeName:
 *                 type: string
 *                 description: The type of reaction (e.g., like, retweet)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully added the reaction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reaction'
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /reaction/{reactionId}:
 *   delete:
 *     summary: Delete a reaction by ID
 *     tags: [Reaction]
 *     parameters:
 *       - in: path
 *         name: reactionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the reaction to delete
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully deleted the reaction
 *       404:
 *         description: Reaction not found
 */

/**
 * @swagger
 * /reaction/{authorId}/{reactionTypeName}:
 *   get:
 *     summary: Get reactions of a specific type by a user
 *     tags: [Reaction]
 *     parameters:
 *       - in: path
 *         name: authorId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user whose reactions to retrieve
 *       - in: path
 *         name: reactionTypeName
 *         schema:
 *           type: string
 *         required: true
 *         description: The type of reaction (e.g., like, retweet)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the reactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reaction'
 *       404:
 *         description: Reactions not found
 */