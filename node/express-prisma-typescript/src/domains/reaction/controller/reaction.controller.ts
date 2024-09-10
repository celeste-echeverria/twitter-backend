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
  const { reactionType }  = req.body
  const reaction = await reactionService.createReaction(reactionType, userId, postId)
  return res.status(HttpStatus.OK).json(reaction)
})

reactionRouter.delete('/delete', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { reactionId } = req.body
  console.log('DELETING ', reactionId)
  await reactionService.deleteReaction(reactionId, userId)
  return res.status(HttpStatus.OK).send(`Deleted reaction ${reactionId}`)
})

reactionRouter.get('/:authorId/:type', async (req: Request, res: Response) => {
  const { authorId, type } = req.params

  //TO DO: Get reactions from user 
  const reactions = await reactionService.getUserLikesOrRetweets(authorId, type)
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
 *         type:
 *           type: string
 *           description: The type of reaction (e.g., like, retweet)
 *       required:
 *         - postId
 *         - userId
 *         - type
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
 *               type:
 *                 type: string
 *                 description: The type of reaction (e.g., like, retweet)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully added the reaction
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized. Must login to access
 *       500:
 *         description: Internal Server Error
 * 
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
 *       401:
 *         description: Unauthorized. Must login to access
 *       404:
 *         description: Reaction not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /reaction/{authorId}/{type}:
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
 *         name: type
 *         schema:
 *           type: string
 *         required: true
 *         description: The type of reaction (e.g., likes, retweets)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the reactions
 *       401:
 *         description: Unauthorized. Must login to access
 *       404:
 *         description: Reactions not found
 *       500:
 *         description: Internal Server Error
 */