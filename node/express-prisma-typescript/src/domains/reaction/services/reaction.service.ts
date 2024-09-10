import { ReactionDTO } from "../dto"

export interface ReactionService {
    createReaction: (type: string, userId: string, postId: string) => Promise<ReactionDTO>
    deleteReaction: (reactionId: string, userId: string) => Promise<void>
    getUserReactions: (userId: string) => Promise <ReactionDTO[]>
    getPostReactions: (postId: string) => Promise <ReactionDTO[]>
    getReaction: (reactionId: string) => Promise <ReactionDTO | null>
    getUserLikesOrRetweets: (reactionId: string, type: string) => Promise <ReactionDTO[]>
}
