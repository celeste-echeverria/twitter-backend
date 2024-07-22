// src/services/ChatService.ts
import { MessageDTO, RoomDTO } from '../dto';

export interface ChatService {
  createRoom: (userId: string, otherUserId: string) => Promise<RoomDTO>
  getRoom: (roomId: string) => Promise<RoomDTO | null>
  getAllRooms: () => Promise<RoomDTO[]>
  deleteRoom: (roomId: string) => Promise<void>
  getOrCreateRoom: (userId: string, targetUserId: string) => Promise <string>
  saveMessage: (senderId: string, content: string, roomId: string) => Promise<MessageDTO> 
  getRoomMessages: (roomId: string) => Promise <MessageDTO[]> 
}
