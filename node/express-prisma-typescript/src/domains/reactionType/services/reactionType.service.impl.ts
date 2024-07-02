import { NotFoundException, db } from "@utils";
import { ReactionTypeRepository } from "../repository/reactionType.repository";
import { ReactionTypeRepositoryImpl } from "../repository/reactionType.repository.impl";
import { ReactionTypeService } from "./reactionType.service";
import { ReactionTypeDTO } from "../dto";

export class ReactionTypeServiceImpl implements ReactionTypeService {
    constructor(private readonly reactionTypeRepository: ReactionTypeRepository = new ReactionTypeRepositoryImpl(db)){}
    
    async createReactionType (reactionTypeName: string) : Promise <ReactionTypeDTO>{
        return await this.reactionTypeRepository.create(reactionTypeName)
    }

    async deleteReactionType (reactionTypeId: string) : Promise <void> {
        await this.reactionTypeRepository.delete(reactionTypeId)
    }

    async getReactionTypeById (reactionTypeId: string) : Promise <ReactionTypeDTO> {
        const reactionType = await this.reactionTypeRepository.getById(reactionTypeId)
        if (!reactionType) throw new NotFoundException('Reaction Type')
        return reactionType
    }

    async getReactionByTypeName (typeName: string) : Promise <ReactionTypeDTO> {
        const reactionType = await this.reactionTypeRepository.getByTypeName(typeName)
        if (!reactionType) throw new NotFoundException('Reaction Type')
        return reactionType
    }

    async getReactionTypes () : Promise<ReactionTypeDTO[]> {
        const reactionTypes = await this.reactionTypeRepository.getReactionTypes()
        return reactionTypes
    }
}