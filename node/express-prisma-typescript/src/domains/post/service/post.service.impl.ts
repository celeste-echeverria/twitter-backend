import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'
import { PostRepository, PostRepositoryImpl } from '../repository'
import { PostService } from '.'
import { validate } from 'class-validator'
import { BadRequestException, ForbiddenException, InternalServerErrorException, NotFoundException } from '@utils'
import { db } from '@utils/database'
import { CursorPagination } from '@types'
import { UserService, UserServiceImpl } from '@domains/user/service'
import { FollowService, FollowServiceImpl } from '@domains/follow/service'
import e from 'express'

export class PostServiceImpl implements PostService {
  constructor (
    private readonly postRepository: PostRepository = new PostRepositoryImpl(db), 
    private readonly userService: UserService = new UserServiceImpl(),
    private readonly followService: FollowService = new FollowServiceImpl(),
  ) {}

  async createPost (userId: string, content: CreatePostInputDTO): Promise<PostDTO> {
    try {
      await validate(content)
      return await this.postRepository.create(userId, content)
    } catch (error) {
      throw new InternalServerErrorException("createPost")
    }
  }

  async createComment (userId: string, postId: string, content: CreatePostInputDTO): Promise<PostDTO> {
    try {

      const post = this.getPost(userId, postId)
      if(!post) throw new NotFoundException('Post')
      const author = this.userService.getUser(userId)
      if(!author) throw new NotFoundException('User')

      return await this.postRepository.create(userId, content, postId)
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException("createComment")
    }
  }

  async deletePost (userId: string, postId: string): Promise<void> {
    try {
      const post = await this.postRepository.getById(postId)
      if (!post) throw new NotFoundException('Post')
      if (post.authorId !== userId) throw new ForbiddenException()
      await this.postRepository.delete(postId)
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      if (error instanceof ForbiddenException) throw error
      throw new InternalServerErrorException("deletePost")
    }
    
  }

  async getPost (userId: string, postId: string): Promise<PostDTO> {
    try {
      const post = await this.postRepository.getById(postId)
      if (!post) throw new NotFoundException('Post')

      const canAccess = await this.canAccessUsersPosts(userId, post.authorId)
      if (!canAccess) throw new NotFoundException('Post')

      return post
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException("getPost")
    }
    
  }

  async getLatestPosts (userId: string, options: CursorPagination): Promise<PostDTO[]> {
    try {
      //Gets id of all authors followed by user
      const followedAuthorIds = await this.followService.getFollowedUsersId(userId)
      //Gets id of all public users
      const publicAuthorIds = await this.userService.getPublicUsersIds()

      //Combines public and followed authors
      const visibleAuthorIdsSet = new Set([...followedAuthorIds, ...publicAuthorIds]);
      const visibleAuthorIds = Array.from(visibleAuthorIdsSet)

      return await this.postRepository.getAllByDatePaginated(visibleAuthorIds, options)
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException("getLatestPosts")
    }
    
  }

  async getPostsByAuthor (userId: any, authorId: string): Promise<PostDTO[]> {
    try {
      const canAccess = await this.canAccessUsersPosts(userId, authorId)
      if (!canAccess) throw new NotFoundException('Posts')
      return await this.postRepository.getByAuthorId(authorId)
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException("getPostsByAuthor")
    }
   
  }

  async canAccessUsersPosts (userId: string, authorId: string): Promise <boolean>{
    try {
      if (userId == authorId) {
        return true
      }
      
      const publicAccount = (await this.userService.isPublic(authorId))
      if (publicAccount) {
        return true
      }
  
      return await this.followService.userIsFollowing(userId, authorId)
    } catch (error) {
      throw new InternalServerErrorException("canAccessUsersPosts")
    }
    
  }

  async getCommentsFromPost (userId: string, postId: string): Promise <PostDTO[] | []> {
    try {
      const post = await this.getPost(userId, postId)
      return post.replies ?? []
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException("getCommentsFromPost")
    }
  }

}
