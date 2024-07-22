import { UserDTO } from "@domains/user/dto"

export class RoomDTO {
    constructor(room: RoomDTO){
        this.id = room.id
        this.users = room.users 
    }
    id: string
    users: UserDTO[]
}