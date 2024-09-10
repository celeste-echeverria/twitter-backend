import { UserDTO, UserViewDTO } from "@domains/user/dto"
import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator"


export class RoomDTO {
    constructor (room: RoomDTO) {
        this.id = room.id;
        this.createdAt = room.createdAt;
        this.messages = room.messages;
        this.users = room.users
    }
    id: string;
    users: UserViewDTO[]
    messages: MessageDTO[]
    createdAt: Date;
}

export class MessageDTO{
    constructor (message: MessageDTO) {
        this.id = message.id;
        this.chatId = message.chatId;
        this.senderId = message.senderId;
        this.content = message.content;
        this.createdAt = message.createdAt;
    }
    id: string;
    chatId: string;
    senderId: string;
    content: string
    createdAt: Date;
}


export class ExtendedMessageDTO extends MessageDTO {
    constructor(message: ExtendedMessageDTO){
        super(message)
        this.sender = message.sender
    }
    sender: UserViewDTO

}

export class CreateMessageInputDTO {

    constructor (chatId: string, content: string) {
        this.chatId = chatId;
        this.content = content;
    }
    @IsString()
    @IsNotEmpty()
    chatId!: string 
    @IsString()
    @IsNotEmpty()
    content!: string
    
}


export class CreateRoomInputDTO {
    @IsString()
    @IsNotEmpty()
    otherUserId!: string 
    
    constructor (otherUserId: string) {
        this.otherUserId = otherUserId
    }
}