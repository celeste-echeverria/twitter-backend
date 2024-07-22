import { ChatRepository } from './chat.repository';
import { MessageDTO, RoomDTO } from '../dto';
import { UserDTO } from '@domains/user/dto';
import { PrismaClient } from '@prisma/client';

export class ChatRepositoryImpl implements ChatRepository {
    constructor(private readonly db: PrismaClient){}

    async saveMessage (senderId: string, recipientId: string, content: string): Promise<MessageDTO> {
        const message = await this.db.message.create({
            data: {
                content,
                senderId,
                recipientId,
            }
        })
        return new MessageDTO(message)
    }

    async getMessagesFromChat (userId: string): Promise<MessageDTO[]> {
        const messages = await this.db.message.findMany({
            where: {
                AND: {
                    OR: {
                        recipientId: userId,
                        senderId: userId
                    }
                }
                
            },
            orderBy: {createdAt: 'asc'}
        })
        return messages.map(message => new MessageDTO(message))
    }

}
