import { ReactionDTO } from "../dto";

export interface ReactionRepository {
    create: (reactionTypeId: string, authorId: string, postId: string) => Promise <ReactionDTO>
    delete: (reactionId: string) => Promise <void>
    getUserReactionFromPost: (userId: string, postId: string, reactionTypeId: string) => Promise <ReactionDTO | null> 
    getReactionsByUserId: (authorId: string) => Promise <ReactionDTO[]>
    getReactionById: (id: string) => Promise <ReactionDTO | null>
    getReactionsByPostId: (postId: string) => Promise <ReactionDTO[]>
}

