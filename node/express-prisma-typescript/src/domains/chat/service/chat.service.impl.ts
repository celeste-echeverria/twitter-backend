import { ChatRepository, ChatRepositoryImpl } from '../repository';
import { CreateRoomInputDTO, MessageDTO, RoomDTO } from '../dto';
import { ChatService } from './chat.service';
import { BadRequestException, db, InternalServerErrorException, NotFoundException } from '@utils';
import { FollowService, FollowServiceImpl } from '@domains/follow/service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ClassType } from '@types';
import { UserService, UserServiceImpl } from '@domains/user/service';

export class ChatServiceImpl implements ChatService {

    constructor(
        private readonly chatRepository: ChatRepository = new ChatRepositoryImpl(db),
        private readonly followService: FollowService = new FollowServiceImpl(),
        private readonly userService : UserService = new UserServiceImpl()
    ) {} 

    async createRoom(userId: string, otherUserId: string): Promise<RoomDTO | null> {
        try{
            const otherUser = await this.userService.getUserView(userId, otherUserId);
            if (!otherUser) throw new NotFoundException("other User");

            const existingChat = await this.chatRepository.getUsersChat(userId, otherUserId);
            if (existingChat) return existingChat;

            const mutualFollow = await this.followService.usersAreMutuals(userId, otherUserId)
            if(!mutualFollow) throw new BadRequestException("Not mutuals");

            return await this.chatRepository.createChat(userId, otherUserId);
        }catch (error) {
            if (error instanceof NotFoundException) throw error
            if (error instanceof BadRequestException) throw error
            throw new InternalServerErrorException("createRoom")
        }
        
    }

    async getOldMessagesFromChat(userId: string, otherUserId: string): Promise<MessageDTO[]> {
        try {
            return await this.chatRepository.getMessagesFromChat(userId, otherUserId)
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException("getOldMessagesFromChat")
        }
    }

    async createMessage(userId: string, chatId: string, content: string): Promise<MessageDTO> {
        try {
            const existingChat = await this.chatRepository.getChatById(chatId);
            if (!existingChat) throw new NotFoundException('Chat');
            
            const message = await this.chatRepository.createMessage(userId, chatId, content);
            if(!message) throw new InternalServerErrorException('createMessage')
            return message
        
        } catch (error) {
            console.log(error)
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException('createMessage')
        }
    }

}
