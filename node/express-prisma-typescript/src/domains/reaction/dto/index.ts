export class ReactionDTO {
    constructor (reaction: ReactionDTO){
        this.id = reaction.id
        this.reactionTypeId = reaction.reactionTypeId
        this.createdAt = reaction.createdAt
        this.userId = reaction.userId
        this.postId = reaction.postId
    }

    id: string
    reactionTypeId: string
    createdAt: Date
    userId: string
    postId: string

}