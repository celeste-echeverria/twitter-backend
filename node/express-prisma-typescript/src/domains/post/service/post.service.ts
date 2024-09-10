import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'

export interface PostService {
  createPost: (userId: string, content: CreatePostInputDTO) => Promise<PostDTO>
  createComment: (user: string, postId: string, content: CreatePostInputDTO) => Promise<PostDTO>
  
  deletePost: (userId: string, postId: string) => Promise<void>
  
  getPost: (userId: string, postId: string) => Promise<ExtendedPostDTO | null>
  getLatestPosts: (userId: string, options: { limit?: number, before?: string, after?: string }) => Promise<any>
  getLatestPostsByFollowedUsers: (userId: string, options: { limit?: number, before?: string, after?: string }) => Promise<any>

  getPostsByAuthor: (userId: any, authorId: string, options:{ limit?: number, before?: string, after?: string }) => Promise<any>
  getCommentsFromPost: (userId: string, postId: string, options:{ limit?: number, before?: string, after?: string }) => Promise <ExtendedPostDTO[] | []>

  canAccessUsersPosts: (userId: string, authorId: string) => Promise <boolean>

  getUploadImageUrl: (userId: string) => Promise <{fileName: string, url: string}>

  incrementPostRetweetsCount: (postId: string) => Promise <void> 
  incrementPostLikesCount: (postId: string) => Promise <void> 
  incrementPostRepliesCount: (postId: string) => Promise <void> 

}
