import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'
import { PostRepository, PostRepositoryImpl } from '../repository'
import { PostService } from '.'
import { validate } from 'class-validator'
import {ForbiddenException, InternalServerErrorException, NotFoundException } from '@utils/errors'
import { db } from '@utils/database'
import { CursorPagination } from '@types'
import { UserService, UserServiceImpl } from '@domains/user/service'
import { FollowService, FollowServiceImpl } from '@domains/follow/service'
import { getPresignedGetURL, getPresignedPutUrl } from '@utils/aws.s3'
import { v4 as uuidv4 } from 'uuid'


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
      await validate(content)
      const post = await this.getPost(userId, postId)
      const author = await this.userService.getUser(post?.authorId)

      return await this.postRepository.create(author.id, content, post?.id)
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

  async getPost(userId: string, postId: string): Promise<ExtendedPostDTO | null> {
    try {
      const post = await this.postRepository.getById(postId);
      if (!post) {
        throw new NotFoundException('Post');
      }
  
      const canAccess = await this.canAccessUsersPosts(userId, post.authorId);
      if (!canAccess) {
        throw new NotFoundException('Post');
      }
  
      let urls;
      if (post.images && post.images.length > 0) {
        const urlPromises = post.images.map(async (image) => {
          return await getPresignedGetURL(image);
        });
        urls = await Promise.all(urlPromises);
      }
  
      return { ...post, images: urls };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException("getPost");
    }
  }
  
  async incrementPostRetweetsCount(postId: string): Promise <void> {
    try {
      await this.postRepository.incrementRetweetsCount(postId)
    } catch (error) {
      throw new InternalServerErrorException("incrementPostReactionCount")
    }
  }

  async incrementPostLikesCount(postId: string): Promise <void> {
    try {
      await this.postRepository.incrementLikesCount(postId)
    } catch (error) {
      throw new InternalServerErrorException("incrementPostReactionCount")
    }
  }
  
  async incrementPostRepliesCount(postId: string): Promise <void> {
    try {
      await this.postRepository.incrementRepliesCount(postId)
    } catch (error) {
      throw new InternalServerErrorException("incrementPostReactionCount")
    }
  }

  async getLatestPosts (userId: string, options: CursorPagination): Promise<any> {
    try {
      const { limit, after, before } = options;

      //Gets id of all authors followed by user
      const followedAuthorIds = await this.followService.getFollowedUsersId(userId)
      //Gets id of all public users
      const publicAuthorIds = await this.userService.getPublicUsersIds()

      //Combines public and followed authors
      const visibleAuthorIdsSet = new Set([...followedAuthorIds, ...publicAuthorIds]);
      const visibleAuthorIds = Array.from(visibleAuthorIdsSet)

      const posts = await this.postRepository.getAllByDatePaginated(visibleAuthorIds, {
        limit, after, before
      })

      const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : undefined;

      return {
        posts: posts,
        nextCursor
      };

    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException("getLatestPosts")
    }
    
  }

  async getLatestPostsByFollowedUsers (userId: string, options: CursorPagination): Promise<any> {
    try {
      const { limit, after, before } = options;

      //Gets id of all authors followed by user
      const followedAuthorIds = await this.followService.getFollowedUsersId(userId)
      
      const posts = await this.postRepository.getAllByDatePaginated(followedAuthorIds, {
        limit, after, before
      })

      const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : undefined;

      return {
        posts: posts,
        nextCursor
      };

    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException("getLatestPostsByFollowedUsers")
    }
    
  }

  async getPostsByAuthor (userId: any, authorId: string, options: CursorPagination): Promise<any> {
    try {
      const canAccess = await this.canAccessUsersPosts(userId, authorId)
      if (!canAccess) throw new NotFoundException('Posts')
      
      // Extract pagination options
      const { limit, after, before } = options;

      // Get posts from repository
      const posts = await this.postRepository.getByAuthorId(authorId, {
        limit,
        after,
        before
      });
      
      const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : undefined;

      return {
        posts: posts,
        nextCursor
      };

    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException("getPostsByAuthor")
    }
   
  }

  async canAccessUsersPosts(userId: string, authorId: string): Promise<boolean> {
    try {
  
      if (userId === authorId) {
        return true;
      }
  
      const publicAccount = await this.userService.isPublic(authorId);
      if (publicAccount) {
        return true;
      }
  
      const isFollowing = await this.followService.userIsFollowing(userId, authorId);
      return isFollowing;
    } catch (error) {
      throw new InternalServerErrorException("canAccessUsersPosts");
    }
  }
  

  async getCommentsFromPost (userId: string, postId: string, options:{ limit?: number, before?: string, after?: string }): Promise <ExtendedPostDTO[] | []> {
    try {
      const replies = await this.postRepository.getCommentsByMainPostId(postId, options)
      
      return replies
    } catch (error) {
      if (error instanceof NotFoundException) throw error
      throw new InternalServerErrorException("getCommentsFromPost")
    }
  }

  async getUploadImageUrl(userId: string): Promise <{fileName: string, url: string}>{
    try {
      const imageName = uuidv4()
      const fileName = `posts/${userId}/${imageName}.jpg`
      const url = await getPresignedPutUrl(fileName)
      return {fileName, url}
    } catch (error) {
      throw new InternalServerErrorException('getUploadImagesUrls')
    }
  }
}
