import { ReactionTypeDTO } from "../dto"

export interface ReactionTypeService {
    createReactionType: (reactionTypeId: string) => Promise <ReactionTypeDTO>
    deleteReactionType: (id: string) => Promise <void>
    getReactionTypeById: (id: string) => Promise <ReactionTypeDTO>
    getReactionByTypeName: (typeName: string) => Promise <ReactionTypeDTO>
    getReactionTypes: () => Promise<ReactionTypeDTO[]>
}

