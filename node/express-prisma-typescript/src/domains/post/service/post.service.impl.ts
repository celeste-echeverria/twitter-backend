import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'
import { PostRepository, PostRepositoryImpl } from '../repository'
import { PostService } from '.'
import { validate } from 'class-validator'
import { BadRequestException, ForbiddenException, NotFoundException } from '@utils'
import { db } from '@utils/database'
import { CursorPagination } from '@types'
import { UserService, UserServiceImpl } from '@domains/user/service'
import { FollowService, FollowServiceImpl } from '@domains/follow/service'

export class PostServiceImpl implements PostService {
  constructor (
    private readonly postRepository: PostRepository = new PostRepositoryImpl(db), 
    private readonly userService: UserService = new UserServiceImpl(),
    private readonly followService: FollowService = new FollowServiceImpl(),
  ) {}

  async createPost (userId: string, content: CreatePostInputDTO): Promise<PostDTO> {
    await validate(content)
    return await this.postRepository.create(userId, content)
  }

  async createComment (userId: string, postId: string, content: CreatePostInputDTO): Promise<PostDTO> {
    const post = this.getPost(userId, postId)
    if(!post) throw new NotFoundException('post')
    const author = this.userService.getUser(userId)
    if(!author) throw new NotFoundException('user')

    return await this.postRepository.create(userId, content, postId)
  }

  async deletePost (userId: string, postId: string): Promise<void> {
    const post = await this.postRepository.getById(postId)
    if (!post) throw new NotFoundException('post')
    if (post.authorId !== userId) throw new ForbiddenException()
    await this.postRepository.delete(postId)
  }

  async getPost (userId: string, postId: string): Promise<PostDTO> {
    const post = await this.postRepository.getById(postId)
    if (!post) throw new NotFoundException('post')

    const canAccess = await this.canAccessUsersPosts(userId, post.authorId)
    if (!canAccess) throw new NotFoundException('Post')
    return post
  }

  async getLatestPosts (userId: string, options: CursorPagination): Promise<PostDTO[]> {
    //Gets id of all authors followed by user
    const followedAuthorIds = await this.followService.getFollowedUsersId(userId)
    //Gets id of all public users
    const publicAuthorIds = await this.userService.getPublicUsersIds()

    //Combines public and followed authors
    const visibleAuthorIdsSet = new Set([...followedAuthorIds, ...publicAuthorIds]);
    const visibleAuthorIds = Array.from(visibleAuthorIdsSet)

    return await this.postRepository.getAllByDatePaginated(visibleAuthorIds, options)
  }

  async getPostsByAuthor (userId: any, authorId: string): Promise<PostDTO[]> {
    const canAccess = await this.canAccessUsersPosts(userId, authorId)
    if (!canAccess) throw new NotFoundException('Posts')
    return await this.postRepository.getByAuthorId(authorId)
  }

  async canAccessUsersPosts (userId: string, authorId: string): Promise <boolean>{
    if (userId == authorId) {
      return true
    }
    
    const publicAccount = (await this.userService.isPublic(authorId))
    if (publicAccount) {
      return true
    }

    return await this.followService.userIsFollowing(userId, authorId)
  }

  async getCommentsFromPost (userId: string, postId: string): Promise <PostDTO[]> {
    try {

      const post = await this.getPost(userId, postId)
      if (!post.replies) {
        throw new NotFoundException('replies')
      }
      return post.replies
      
    } catch (error) {
      throw error
    }
  }

}
