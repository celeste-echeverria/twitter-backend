import { ChatRepository } from './chat.repository';
import { CreateMessageInputDTO, MessageDTO, RoomDTO } from '../dto';
import { UserDTO } from '@domains/user/dto';
import { PrismaClient } from '@prisma/client';

export class ChatRepositoryImpl implements ChatRepository {
    constructor(private readonly db: PrismaClient){}

    async getMessagesFromChat (userId: string, otherUserId: string): Promise<MessageDTO[]> {
        const messages = await this.db.message.findMany({
            where: {
                OR: [
                    {
                        senderId: otherUserId
                    },
                    {
                        senderId: userId
                    }
                ]
            },
            orderBy: {createdAt: 'asc'}
        })
        return messages.map(message => new MessageDTO(message))
    }

    async createChat (userId: string,otherUserId: string): Promise<RoomDTO> {
        const chat = await this.db.chat.create({
            data: {
                users: {
                  connect: [
                    { id: userId },
                    { id: otherUserId }
                  ]
                },
              },
            include:{
                users: true, 
                messages: {
                    include:{
                        sender: true,
                    }
                }
            }
        })
        return new RoomDTO(chat) 
    }

    async getUsersChat (userId: string,otherUserId: string): Promise<RoomDTO | null> {
        const chat = await this.db.chat.findFirst({
            where: {
              AND: [
                { users: { some: { id: userId } } },
                { users: { some: { id: otherUserId } } }
              ],
            },
            include: {
              users: true, 
              messages: true 
            }
        });
        return chat ? new RoomDTO(chat) : null
    }

    async getChatById(chatId: string) : Promise <RoomDTO | null>{
        const chat = await this.db.chat.findUnique({
            where: {
                id: chatId,  // Busca el chat por su ID
            },
            include: {
                users: true,  // Para incluir los usuarios asociados al chat
                messages: true // Para incluir los mensajes asociados al chat
            }
        });
      
        return chat ? new RoomDTO(chat) : null
    }
      
    async createMessage(userId: string, chatId: string, content: string): Promise<MessageDTO | null> {
        const message = await this.db.message.create({
            data: {
                content: content,
                chat: {
                  connect: { id: chatId } // Conecta el mensaje al chat existente
                },
                sender: {
                  connect: { id: userId } // Conecta el mensaje al usuario existente
                },
            },
            include:{
                sender: true,
            }  
        })
        return new MessageDTO(message)
    }
}
