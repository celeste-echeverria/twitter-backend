import { ReactionTypeDTO } from "../dto";
import { ReactionTypeRepository } from "./reactionType.repository";
import { PrismaClient } from "@prisma/client";

export class ReactionTypeRepositoryImpl implements ReactionTypeRepository {
    constructor (private readonly db: PrismaClient) {}

    async create (typeName: string): Promise<ReactionTypeDTO>{
        const reactionType = await this.db.reactionType.create({
            data: {
                typeName,
            }
        })
        return new ReactionTypeDTO(reactionType)
    };
    
    async delete (reactionTypeId: string): Promise<void> {
        const reactionType = await this.db.reactionType.delete({
            where: {
                id: reactionTypeId,
            },
        });
    }
    
    async getById (reactionTypeId: string): Promise <ReactionTypeDTO | null> {
        const reactionType = await this.db.reactionType.findUnique({
            where:{
                id: reactionTypeId
            }
        })
        return (reactionType != null) ? new ReactionTypeDTO(reactionType) : null
    }

    async getByTypeName (reactionTypeName: string): Promise <ReactionTypeDTO | null> {
        const reactionType = await this.db.reactionType.findUnique({
            where:{
                typeName: reactionTypeName
            }
        })
        return (reactionType != null) ? new ReactionTypeDTO(reactionType) : null
    }

    async getReactionTypes (): Promise <ReactionTypeDTO[]> {
        const reactionTypes = await this.db.reactionType.findMany()
        return reactionTypes.map(reactionType => new ReactionTypeDTO(reactionType))
    }
    
}
