import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'
import { ChatService, ChatServiceImpl } from '../service'


export const chatRouter = Router()

const chatService: ChatService = new ChatServiceImpl()

//Get upload images url
chatRouter.get('/messages/:userId', async (req: Request, res: Response) => {
    const { userId } = res.locals.context
    const { userId: mutualId } = req.params

    const messages = await chatService.getOldMessagesFromChat(userId, mutualId)
    return res.status(HttpStatus.OK).json(messages)
})

