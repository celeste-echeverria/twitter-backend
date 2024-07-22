import { ChatRepository } from './chat.repository';
import { MessageDTO, RoomDTO } from '../dto';
import { UserDTO } from '@domains/user/dto';
import { PrismaClient } from '@prisma/client';

export class ChatRepositoryImpl implements ChatRepository {
    constructor(private readonly db: PrismaClient){}

    async createRoom(userId: string, otherUserId: string): Promise<RoomDTO> {
        const newRoom = await this.db.room.create({
            data: {
              users: {
                connect: [
                  { id: userId },
                  { id: otherUserId },
                ],
              },
            },
            include: {
              users: true,
            },
        });
        return new RoomDTO(newRoom);
    }

    async getRoomByUsersIds(userId: string, otherUserId: string): Promise<RoomDTO | null> {
        const room = await this.db.room.findFirst({
            where: {
              users: {
                some: {
                  id: userId,
                },
              },
              AND: {
                users: {
                  some: {
                    id: otherUserId,
                  },
                },
              },
            },
            include: {
              users: true,
            },
        });
        return room ? new RoomDTO(room) : null
    }

    async getRoomById(roomId: string): Promise<RoomDTO | null> {
        const room = await this.db.room.findUnique({
            where: { id: roomId },
            include: { users: true },
        })

        if (!room) {
            return null;
        }

        const users = room.users.map(user => new UserDTO(user));
        return new RoomDTO({ id: room.id, users });
    }

    async getAllRooms(): Promise<RoomDTO[]> {
        const rooms = await this.db.room.findMany({
            include: { users: true },
        })

        return rooms.map(room => {
            const users = room.users.map(user => new UserDTO(user));
            return new RoomDTO({ id: room.id, users });
        })
    }

    async deleteRoom(roomId: string): Promise<void> {
        await this.db.room.delete({
            where: { id: roomId },
        })
    }

    async saveMessage (senderId: string, content: string, roomId: string): Promise<MessageDTO> {
        const message = await this.db.message.create({
            data: {
                roomId,
                content,
                senderId
            }
        })
        return new MessageDTO(message)
    }

    async getMessagesFromRoom (roomId: string): Promise <MessageDTO[]> {
        const messages = await this.db.message.findMany({
            where:{
                roomId
            }
        })
        return messages.map(msg => new MessageDTO(msg))
    }
}
