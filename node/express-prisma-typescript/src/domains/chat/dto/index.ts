import { UserDTO } from "@domains/user/dto"

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
    }

    content: string
    senderId: string
}

export class ExtendedMessageDTO extends MessageDTO {
    constructor(message: ExtendedMessageDTO){
        super(message)
        this.sender = message.sender
    }
    sender: UserDTO

}