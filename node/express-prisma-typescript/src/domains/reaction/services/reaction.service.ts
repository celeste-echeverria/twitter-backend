import { ReactionDTO } from "../dto"

export interface ReactionService {
    createReaction: (reactionTypeName: string, userId: string, postId: string) => Promise<ReactionDTO>
    deleteReaction: (reactionTypeName: string, userId: string, postId: string) => Promise<void>
    getUserReactions: (userId: string) => Promise <ReactionDTO[]>
    getPostReactions: (postId: string) => Promise <ReactionDTO[]>
    getReaction: (reactionId: string) => Promise <ReactionDTO | null>
}
