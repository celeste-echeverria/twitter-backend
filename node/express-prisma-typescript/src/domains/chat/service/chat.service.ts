// src/services/ChatService.ts
import { MessageDTO, RoomDTO } from '../dto';

export interface ChatService {
  saveMessage: (senderId: string, toUserId: string, content: string) => Promise<MessageDTO> 
  getOldMessagesFromChat: (userId: string) => Promise<Map<string, MessageDTO[]> | undefined>
}
