import { PrismaClient } from "@prisma/client";
import { ReactionDTO } from "../dto";
import { ReactionRepository } from "./reaction.repository";

export class ReactionRepositoryImpl implements ReactionRepository {
    constructor(private readonly db: PrismaClient) {}

    async create (type: string, userId: string, postId: string): Promise <ReactionDTO> {
        const reaction = await this.db.reaction.create({
            data: {
                userId,
                type,
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

    async getUserReactionFromPost(userId: string, postId: string, type: string): Promise <ReactionDTO | null> {
        const reaction = await this.db.reaction.findUnique({
            where: {
                userId_postId_type: {
                    userId,
                    postId,
                    type
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

    async getReactionsByUserIdAndType(userId: string, type: string): Promise<ReactionDTO[]> {
        const reactions = await this.db.reaction.findMany({
            where: { 
                userId,
                type
            },
        });
        return reactions.map(reaction => new ReactionDTO(reaction))
    }
    
    async getReactionById(id: string): Promise<ReactionDTO | null> {
        const reaction = await this.db.reaction.findUnique({
          where: { id },
        });
        console.log('FOUND REACTION:', reaction)
        return (reaction != null) ? new ReactionDTO(reaction) : null
    }
    
    async getReactionsByPostId(postId: string): Promise<ReactionDTO[]> {
        const reactions = await this.db.reaction.findMany({
          where: { postId },
        });
        return reactions.map(reaction => new ReactionDTO(reaction))
      }
}