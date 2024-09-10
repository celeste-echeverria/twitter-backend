import {MessageDTO, RoomDTO } from '../dto';

export interface ChatService {
  getOldMessagesFromChat: (userId: string, otherUserId: string) => Promise<MessageDTO[]>
  createRoom: (userId: string, otherUserId: string) => Promise<RoomDTO | null>
  createMessage: (userId: string, chatId: string, content: string) => Promise<MessageDTO>
} 
