import { CreatePostInputDTO, PostDTO } from '../dto'
import { PostRepository, PostRepositoryImpl } from '../repository'
import { PostService } from '.'
import { validate } from 'class-validator'
import { ForbiddenException, NotFoundException, UnauthorizedException } from '@utils'
import { db } from '@utils/database'
import { CursorPagination } from '@types'
import { UserService, UserServiceImpl } from '@domains/user/service'
import { FollowService, FollowServiceImpl } from '@domains/follow/service'

export class PostServiceImpl implements PostService {
  constructor (
    private readonly repository: PostRepository = new PostRepositoryImpl(db), 
    private readonly userService: UserService = new UserServiceImpl(),
    private readonly followService: FollowService = new FollowServiceImpl(),
  ) {}

  async createPost (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    await validate(data)
    return await this.repository.create(userId, data)
  }

  async deletePost (userId: string, postId: string): Promise<void> {
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('post')
    if (post.authorId !== userId) throw new ForbiddenException()
    await this.repository.delete(postId)
  }

  async getPost (userId: string, postId: string): Promise<PostDTO> {
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('post')

    const canAccess = await this.canAccessUsersPosts(userId, post.authorId)
    if (!canAccess) throw new UnauthorizedException('You do not have access to this post')
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
    return await this.repository.getAllByDatePaginated(visibleAuthorIds, options)
  }

  async getPostsByAuthor (userId: any, authorId: string): Promise<PostDTO[]> {
    const canAccess = await this.canAccessUsersPosts(userId, authorId)
    if (!canAccess) throw new UnauthorizedException('You do not have access to this post')
    
    return await this.repository.getByAuthorId(authorId)
  }

  async canAccessUsersPosts (userId: string, authorId: string): Promise <boolean>{
    const publicAccount = (await this.userService.isPublic(authorId))
    if (publicAccount) {
      return true
    }
    return await this.followService.userIsFollowing(userId, authorId)
  }
}
