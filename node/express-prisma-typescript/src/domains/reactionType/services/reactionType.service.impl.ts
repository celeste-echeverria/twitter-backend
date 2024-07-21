import { InternalServerErrorException, NotFoundException } from "@utils/errors";
import { db } from '@utils/database'
import { ReactionTypeRepository } from "../repository/reactionType.repository";
import { ReactionTypeRepositoryImpl } from "../repository/reactionType.repository.impl";
import { ReactionTypeService } from "./reactionType.service";
import { ReactionTypeDTO } from "../dto";

export class ReactionTypeServiceImpl implements ReactionTypeService {
    constructor(private readonly reactionTypeRepository: ReactionTypeRepository = new ReactionTypeRepositoryImpl(db)){}
    
    async createReactionType (reactionTypeName: string) : Promise <ReactionTypeDTO>{
        try {
            return await this.reactionTypeRepository.create(reactionTypeName)
        } catch (error) {
            throw new InternalServerErrorException("createReactionType")
        } 
    }

    async deleteReactionType (reactionTypeId: string) : Promise <void> {
        try {
            await this.reactionTypeRepository.delete(reactionTypeId)
        } catch (error) {
            throw new InternalServerErrorException("deleteReactionType")
        }
    }

    async getReactionTypeById (reactionTypeId: string) : Promise <ReactionTypeDTO> {
        try {
            const reactionType = await this.reactionTypeRepository.getById(reactionTypeId)
            if (!reactionType) throw new NotFoundException('Reaction Type')
            return reactionType    
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException("getReactionTypeById")
        }
    }

    async getReactionByTypeName (typeName: string) : Promise <ReactionTypeDTO> {
        try {
            const reactionType = await this.reactionTypeRepository.getByTypeName(typeName)
            if (!reactionType) throw new NotFoundException('Reaction Type')
            return reactionType
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException("getReactionTypeByName")
        }
    }

    async getReactionTypes () : Promise<ReactionTypeDTO[]> {
        try {
            const reactionTypes =  await this.reactionTypeRepository.getReactionTypes()
            if (!reactionTypes) throw new NotFoundException("Reaction Types")
            return reactionTypes
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException("getReactionTypeByName")
        }
    }
}