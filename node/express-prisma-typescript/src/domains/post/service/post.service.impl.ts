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
    // TODO: validate that the author has public profile or the user follows the author
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('post')

    const canAccess = await this.canAccessPost(userId, post)
    if (!canAccess) throw new UnauthorizedException('You do not have access to this post')
    return post
  }

  async getLatestPosts (userId: string, options: CursorPagination): Promise<PostDTO[]> {
    // TODO: filter post search to return posts from authors that the user follows
    return await this.repository.getAllByDatePaginated(options)
  }

  async getPostsByAuthor (userId: any, authorId: string): Promise<PostDTO[]> {
    // TODO: throw exception when the author has a private profile and the user doesn't follow them
    return await this.repository.getByAuthorId(authorId)
  }

  async canAccessPost (userId: string, post: PostDTO): Promise <boolean>{
    const publicAccount = (await this.userService.isPublic(post.authorId))
    if (publicAccount) {
      return true
    }
    return await this.followService.userIsFollowing(userId, post.authorId)
  }
}
