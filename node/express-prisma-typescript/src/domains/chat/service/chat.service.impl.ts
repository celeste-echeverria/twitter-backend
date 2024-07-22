// src/services/ChatServiceImpl.ts
import { ChatRepository, ChatRepositoryImpl } from '../repository';
import { MessageDTO, RoomDTO } from '../dto';
import { ChatService } from './chat.service';
import { db, InternalServerErrorException, NotFoundException } from '@utils';
import { FollowService, FollowServiceImpl } from '@domains/follow/service';

export class ChatServiceImpl implements ChatService {

    constructor(
        private readonly chatRepository: ChatRepository = new ChatRepositoryImpl(db),
        private readonly followService: FollowService = new FollowServiceImpl()
    ) {} 

    async saveMessage(senderId: string, toUserId: string, content: string): Promise<MessageDTO> {
        try {
            const message = await this.chatRepository.saveMessage(senderId, toUserId, content)
            return message
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException("saveMessage")
        }
    }

    async getOldMessagesFromChat(userId: string): Promise<Map<string, MessageDTO[]> | undefined> {
        try {
            const oldMessages = await this.chatRepository.getMessagesFromChat(userId)
            if (oldMessages) {
                const userMessages = new Map<string, MessageDTO[]>()
                oldMessages.map((message) => {
                    const key = (message.senderId === userId) ? message.recipientId : message.senderId
                    if(userMessages.has(key)) {
                        userMessages.get(key)?.push(message)
                    } else {
                        userMessages.set(key, [message])
                    }
                })
                console.log(oldMessages)
                return userMessages
            }
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException("getOldMessagesFromChat")
        }
        
    }

}
