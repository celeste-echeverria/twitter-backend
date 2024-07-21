import { BadRequestException, ForbiddenException, InternalServerErrorException, NotFoundException} from "@utils/errors";
import { db } from '@utils/database'
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

        try{
            const post = await this.postService.getPost(userId, postId)
            if (!post) throw new NotFoundException("Post")

            const reactionType = await this.reactionTypeService.getReactionByTypeName(reactionTypeName)
            if(!reactionType) throw new NotFoundException("Reaction Type")

            const reaction = await this.reactionRepository.getUserReactionFromPost(userId, postId, reactionType.id)
            if (reaction) throw new BadRequestException("Reaction")
            if (reactionTypeName === "Retweet") await this.postService.incrementPostRetweetsCount(postId)
            if (reactionTypeName == "Like") await this.postService.incrementPostLikesCount(postId)
            
            return await this.reactionRepository.create(reactionType.id, userId, postId)

        } catch (error) {
            if (error instanceof NotFoundException) throw error
            if (error instanceof BadRequestException) throw error
            throw new InternalServerErrorException("createReaction")
        }
    }

    async deleteReaction (reactionId: string, userId: string) : Promise<void> {
        
        try{    
            const reaction = await this.reactionRepository.getReactionById(reactionId)

            if (!reaction) throw new NotFoundException('Reaction')
            if (reaction.userId !== userId) throw new ForbiddenException()

            await this.reactionRepository.delete(reaction.id)
        
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            if (error instanceof ForbiddenException) throw error
            throw new InternalServerErrorException("deleteReaction")
        }
    }

    async getUserReactions (userId: string) : Promise <ReactionDTO[]> {
        
        try{
            return await this.reactionRepository.getReactionsByUserId(userId)
        } catch (error) {
            throw new InternalServerErrorException("getUserReactions")
        }
    }

    async getPostReactions (postId: string) : Promise <ReactionDTO[]> {

        try {
            return await this.reactionRepository.getReactionsByPostId(postId)
        } catch (error) {
            throw new InternalServerErrorException("getPostReactions")
        }
    }

    async getReaction (reactionId: string) : Promise <ReactionDTO | null> {

        try {
            return await this.reactionRepository.getReactionById(reactionId)
        } catch (error) {
            throw new InternalServerErrorException("getReaction")
        }
    } 

    async getUserLikesOrRetweets(userId: string, reactionTypeName: string): Promise <ReactionDTO[]> {
        try {
            const reactionType =  await this.reactionTypeService.getReactionByTypeName(reactionTypeName)
            if (!reactionType) throw new NotFoundException("Reaction Type")
            const reactions = await this.reactionRepository.getReactionsByUserIdAndType(userId, reactionType.id)
            return reactions ?? []
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException("getUserLikesOrRetweets")
        }
    }

}