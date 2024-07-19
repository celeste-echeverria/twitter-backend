import { PrismaClient } from "@prisma/client";
import { ReactionDTO } from "../dto";
import { ReactionRepository } from "./reaction.repository";

export class ReactionRepositoryImpl implements ReactionRepository {
    constructor(private readonly db: PrismaClient) {}

    async create (reactionTypeId: string, userId: string, postId: string): Promise <ReactionDTO> {
        const reaction = await this.db.reaction.create({
            data: {
                userId,
                reactionTypeId,
                postId
            }
        });
        return new ReactionDTO(reaction)
    }

    async delete (reactionId: string): Promise<void> {
        await this.db.reaction.delete({
            where: {
                id: reactionId
            }
        })
    }

    async getUserReactionFromPost(userId: string, postId: string, reactionTypeId: string): Promise <ReactionDTO | null> {
        const reaction = await this.db.reaction.findUnique({
            where: {
                userId_postId_reactionTypeId: {
                    userId,
                    postId,
                    reactionTypeId
                }
                
            }
        })
        return (reaction != null) ? new ReactionDTO(reaction) : null
    }

    async getReactionsByUserId(userId: string): Promise<ReactionDTO[]> {
        const reactions = await this.db.reaction.findMany({
          where: { userId },
        });
        return reactions.map(reaction => new ReactionDTO(reaction))
    }

    async getReactionsByUserIdAndType(userId: string, reactionTypeId: string): Promise<ReactionDTO[]> {
        const reactions = await this.db.reaction.findMany({
            where: { 
                userId,
                reactionTypeId
            },
        });
        return reactions.map(reaction => new ReactionDTO(reaction))
    }
    
    async getReactionById(id: string): Promise<ReactionDTO | null> {
        const reaction = await this.db.reaction.findUnique({
          where: { id },
        });
        return (reaction != null) ? new ReactionDTO(reaction) : null
    }
    
    async getReactionsByPostId(postId: string): Promise<ReactionDTO[]> {
        const reactions = await this.db.reaction.findMany({
          where: { postId },
        });
        return reactions.map(reaction => new ReactionDTO(reaction))
      }
}