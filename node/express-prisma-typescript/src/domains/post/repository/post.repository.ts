import { CursorPagination } from '@types'
import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'

export interface PostRepository {
  create: (author: string, data: CreatePostInputDTO, mainPostId?: string) => Promise<PostDTO>
  getAllByDatePaginated: (authorsIds: string[], options: CursorPagination) => Promise<ExtendedPostDTO[]>
  delete: (postId: string) => Promise<void>
  getById: (postId: string) => Promise<ExtendedPostDTO | null>
  getByAuthorId: (authorId: string, options: CursorPagination) => Promise<ExtendedPostDTO[]>
  incrementLikesCount: (postId: string) => Promise<void> 
  incrementRetweetsCount: (postId: string) => Promise<void> 
  incrementRepliesCount: (postId: string) => Promise<void> 
  getCommentsByMainPostId: (postId: string, options: { limit?: number, before?: string, after?: string }) => Promise <ExtendedPostDTO[]> 

}
