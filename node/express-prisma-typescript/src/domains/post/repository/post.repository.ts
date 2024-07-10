import { CursorPagination } from '@types'
import { CreatePostInputDTO, PostDTO } from '../dto'
import { UserDTO } from '@domains/user/dto'
import { Post, User } from '@prisma/client'

export interface PostRepository {
  create: (author: string, data: CreatePostInputDTO, mainPostId?: string) => Promise<PostDTO>
  getAllByDatePaginated: (authorsIds: string[], options: CursorPagination) => Promise<PostDTO[]>
  delete: (postId: string) => Promise<void>
  getById: (postId: string) => Promise<PostDTO | null>
  getByAuthorId: (authorId: string) => Promise<PostDTO[]>
}
