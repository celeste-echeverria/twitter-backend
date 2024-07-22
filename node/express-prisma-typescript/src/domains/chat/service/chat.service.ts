// src/services/ChatService.ts
import { RoomDTO } from '../dto';

export interface ChatService {
  createRoom(userId: string, otherUserId: string): Promise<RoomDTO>
  getRoom(roomId: string): Promise<RoomDTO | null>
  getAllRooms(): Promise<RoomDTO[]>
  deleteRoom: (roomId: string) => Promise<void>
  getOrCreateRoom: (userId: string, targetUserId: string) => Promise <string>;
}
