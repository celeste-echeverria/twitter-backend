import { BadRequestException, ForbiddenException, InternalServerErrorException, NotFoundException} from "@utils/errors";
import { db } from '@utils/database'
import { ReactionRepositoryImpl } from "../repository/reaction.repository.impl";
import { ReactionService } from "./reaction.service";
import { ReactionRepository } from "../repository/reaction.repository";
import { PostService, PostServiceImpl } from "@domains/post/service";
import { ReactionDTO } from "../dto";

export class ReactionServiceImpl implements ReactionService {

    constructor(
        private readonly reactionRepository: ReactionRepository = new ReactionRepositoryImpl(db),
        private readonly postService: PostService = new PostServiceImpl(),
    ) {}

    async createReaction (type: string, userId: string, postId: string) : Promise<ReactionDTO> {

        try{
            console.log('type:', type)
            const post = await this.postService.getPost(userId, postId)
            if (!post) throw new NotFoundException("Post")

            const reaction = await this.reactionRepository.getUserReactionFromPost(userId, postId, type)
            if (reaction) throw new BadRequestException("Reaction")
            if (type === "Retweet") await this.postService.incrementPostRetweetsCount(postId)
            if (type === "Like") await this.postService.incrementPostLikesCount(postId)
            
            return await this.reactionRepository.create(type, userId, postId)

        } catch (error) {
            console.log(error)

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
            console.log(error)

            if (error instanceof NotFoundException) throw error
            if (error instanceof ForbiddenException) throw error
            throw new InternalServerErrorException("deleteReaction")
        }
    }

    async getUserReactions (userId: string) : Promise <ReactionDTO[]> {
        
        try{
            return await this.reactionRepository.getReactionsByUserId(userId)
        } catch (error) {
            console.log(error)

            throw new InternalServerErrorException("getUserReactions")
        }
    }

    async getPostReactions (postId: string) : Promise <ReactionDTO[]> {

        try {
            return await this.reactionRepository.getReactionsByPostId(postId)
        } catch (error) {
            console.log(error)

            throw new InternalServerErrorException("getPostReactions")
        }
    }

    async getReaction (reactionId: string) : Promise <ReactionDTO | null> {

        try {
            return await this.reactionRepository.getReactionById(reactionId)
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException("getReaction")
        }
    } 

    async getUserLikesOrRetweets(userId: string, type: string): Promise <ReactionDTO[]> {
        try {
            const reactions = await this.reactionRepository.getReactionsByUserIdAndType(userId, type)
            return reactions ?? []
        } catch (error) {
            console.log(error)

            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException("getUserLikesOrRetweets")
        }
    }

}