import { MessageDTO, RoomDTO } from '../dto';

export interface ChatRepository {
    createRoom: (userId: string, otherUserId: string) => Promise<RoomDTO>
    getRoomById: (roomId: string) => Promise<RoomDTO | null>
    getRoomByUsersIds: (userID: string, otherUserId: string) => Promise <RoomDTO | null>
    getAllRooms: () => Promise<RoomDTO[]>
    deleteRoom: (roomId: string) => Promise<void>
    saveMessage: (senderId: string, content: string, roomId: string) => Promise<MessageDTO>
    getMessagesFromRoom: (roomId: string) =>Promise <MessageDTO[]> 
}