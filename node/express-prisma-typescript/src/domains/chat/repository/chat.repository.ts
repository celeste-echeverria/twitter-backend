import { MessageDTO } from '../dto';

export interface ChatRepository {
    saveMessage: (senderId: string, recipientId: string, content: string) => Promise<MessageDTO>
    getMessagesFromChat: (userId: string) => Promise <MessageDTO[]>
}