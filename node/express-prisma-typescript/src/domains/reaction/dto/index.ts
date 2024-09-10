export class ReactionDTO {
    constructor (reaction: ReactionDTO){
        this.id = reaction.id
        this.type= reaction.type
        this.createdAt = reaction.createdAt
        this.userId = reaction.userId
        this.postId = reaction.postId
    }

    id: string
    type: string
    createdAt: Date
    userId: string
    postId: string

}