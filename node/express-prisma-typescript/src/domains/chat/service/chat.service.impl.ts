// src/services/ChatServiceImpl.ts
import { ChatRepository, ChatRepositoryImpl } from '../repository';
import { RoomDTO } from '../dto';
import { ChatService } from './chat.service';
import { db, InternalServerErrorException, NotFoundException } from '@utils';
import { FollowService, FollowServiceImpl } from '@domains/follow/service';

export class ChatServiceImpl implements ChatService {

    constructor(
        private readonly chatRepository: ChatRepository = new ChatRepositoryImpl(db),
        private readonly followService: FollowService = new FollowServiceImpl()
    ) {} 

    async createRoom(userId: string, otherUserId: string): Promise<RoomDTO> {
        try {
            return await this.chatRepository.createRoom(userId, otherUserId)
        } catch (error) {
            throw new InternalServerErrorException("createRoom")
        }
    }

    async getRoom(roomId: string): Promise<RoomDTO | null> {
        try {
            const room = await this.chatRepository.getRoomById(roomId)
            if(!room) throw new NotFoundException("Room")
            return room
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException("getRoom")
        }
    }

    async getAllRooms(): Promise<RoomDTO[]> {
        try {
            const rooms = await this.chatRepository.getAllRooms();
            return rooms ?? []
        } catch (error) {
            throw new InternalServerErrorException("getAllRooms")
        }
    }

    async deleteRoom(roomId: string): Promise<void> {
        try {
            return await this.chatRepository.deleteRoom(roomId);
        } catch (error) {
            throw new InternalServerErrorException("deleteRoom")
        }
    }

    async getOrCreateRoom (userId: string, targetUserId: string): Promise<string> {
        try {
            const existentRoom = await this.chatRepository.getRoomByUsersIds(userId, targetUserId)
            if (existentRoom) return existentRoom.id
            const room = await this.chatRepository.createRoom(userId, targetUserId)
            return room.id
        } catch (error) {
            throw new InternalServerErrorException("getOrCreateRoom")
        }
    }
}
