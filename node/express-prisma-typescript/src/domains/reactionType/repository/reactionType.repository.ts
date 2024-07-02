import { ReactionTypeDTO } from "../dto"

export interface ReactionTypeRepository {
    create: (typeName: string) => Promise<ReactionTypeDTO>
    delete: (reactionTypeId: string,) => Promise<void>
    getById: (reactionId: string) => Promise<ReactionTypeDTO | null>
    getByTypeName: (typeName: string) => Promise <ReactionTypeDTO | null>
    getReactionTypes: () => Promise<ReactionTypeDTO[]>
}