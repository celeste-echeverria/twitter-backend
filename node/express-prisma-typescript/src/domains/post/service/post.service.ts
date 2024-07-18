import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'

export interface PostService {
  createPost: (userId: string, content: CreatePostInputDTO) => Promise<PostDTO>
  createComment: (user: string, postId: string, content: CreatePostInputDTO) => Promise<PostDTO>
  
  deletePost: (userId: string, postId: string) => Promise<void>
  
  getPost: (userId: string, postId: string) => Promise<PostDTO>
  getLatestPosts: (userId: string, options: { limit?: number, before?: string, after?: string }) => Promise<PostDTO[]>
  getPostsByAuthor: (userId: any, authorId: string) => Promise<PostDTO[]>
  getCommentsFromPost: (userId: string, postId: string) => Promise <PostDTO[] | []>

  canAccessUsersPosts: (userId: string, authorId: string) => Promise <boolean>

  getUploadImageUrl: (userId: string) => Promise <{fileName: string, url: string}>
}
