import { UserDTO } from "@domains/user/dto"
import { IsNotEmpty, IsString } from "class-validator"

export class RoomDTO {
    constructor(room: RoomDTO){
        this.id = room.id
        this.users = room.users 
    }
    id: string
    users: UserDTO[]
}

export class MessageDTO {
    constructor(message: MessageDTO){
        this.content = message.content
        this.senderId = message.senderId
        this.recipientId = message.recipientId
    }

    content: string
    senderId: string
    recipientId: string
}

export class ExtendedMessageDTO extends MessageDTO {
    constructor(message: ExtendedMessageDTO){
        super(message)
        this.sender = message.sender
    }
    sender: UserDTO

}

export class MessageInputDTO {
    constructor(toUserId: string, message: string) {
        this.toUserId = toUserId,
        this.message = message
    }
    @IsNotEmpty()
    @IsString()
    toUserId: string

    @IsString()
    message: string
}