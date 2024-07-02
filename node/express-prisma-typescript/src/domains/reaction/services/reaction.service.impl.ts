import { BadRequestException, ForbiddenException, NotFoundException, db } from "@utils";
import { ReactionRepositoryImpl } from "../repository/reaction.repository.impl";
import { ReactionService } from "./reaction.service";
import { ReactionRepository } from "../repository/reaction.repository";
import { PostService, PostServiceImpl } from "@domains/post/service";
import { ReactionTypeService } from "@domains/reactionType/services/reactionType.service";
import { ReactionTypeServiceImpl } from "@domains/reactionType/services/reactionType.service.impl";
import { ReactionDTO } from "../dto";

export class ReactionServiceImpl implements ReactionService {

    constructor(
        private readonly reactionRepository: ReactionRepository = new ReactionRepositoryImpl(db),
        private readonly reactionTypeService: ReactionTypeService = new ReactionTypeServiceImpl,
        private readonly postService: PostService = new PostServiceImpl(),
    ) {}

    async createReaction (reactionTypeName: string, userId: string, postId: string) : Promise<ReactionDTO> {
        
        await this.postService.getPost(userId, postId)
        const reactionType = await this.reactionTypeService.getReactionByTypeName(reactionTypeName)
        
        const reaction = await this.reactionRepository.getUserReactionFromPost(userId, postId, reactionType.id)
        if (reaction) throw new BadRequestException("Reaction")

        return await this.reactionRepository.create(reactionType.id, userId, postId)
    }

    async deleteReaction (reactionTypeName: string, userId: string, postId: string) : Promise<void> {
        
        const reaction = await this.reactionRepository.getUserReactionFromPost(userId, postId, reactionTypeName)
        if (!reaction) throw new NotFoundException('Reaction')
        if (reaction.userId !== userId) throw new ForbiddenException()
        await this.reactionRepository.delete(reaction.id)
        
    }

    async getUserReactions (userId: string) : Promise <ReactionDTO[]> {

        return await this.reactionRepository.getReactionsByUserId(userId)

    }

    async getPostReactions (postId: string) : Promise <ReactionDTO[]> {

        return await this.reactionRepository.getReactionsByPostId(postId)

    }

    async getReaction (reactionId: string) : Promise <ReactionDTO | null> {

        return await this.reactionRepository.getReactionById(reactionId)

    } 

}