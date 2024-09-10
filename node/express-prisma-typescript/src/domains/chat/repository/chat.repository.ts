import { CreateMessageInputDTO, MessageDTO, RoomDTO } from '../dto';

export interface ChatRepository {
    getMessagesFromChat: (userId: string, otherUserId: string) => Promise <MessageDTO[]>
    createChat: (userId: string,otherUserId: string) => Promise<RoomDTO>
    getUsersChat: (userId: string,otherUserId: string) => Promise<RoomDTO | null>
    getChatById: (chatId: string) => Promise <RoomDTO | null>
    createMessage(userId: string, chatId: string, content: string): Promise<MessageDTO | null>
}