export class ReactionTypeDTO {
    constructor (reactionType: ReactionTypeDTO) {
        this.id = reactionType.id
        this.typeName = reactionType.typeName
    }

    id: string
    typeName: string
}

