import { PrismaClient, Post } from '@prisma/client'

import { CursorPagination } from '@types'

import { PostRepository } from '.'
import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'
import { UserDTO } from '@domains/user/dto'
import { connect } from 'http2'

export class PostRepositoryImpl implements PostRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (authorId: string, data: CreatePostInputDTO, mainPostId?: string): Promise<PostDTO> {
    const post = await this.db.post.create({
      data: {
        content: data.content,
        images: data.images,
        authorId,
        repliesToPostId: mainPostId
      }
    });
    return new PostDTO(post);
  }

  async getAllByDatePaginated (authorsIds: string[], options: CursorPagination): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      cursor: options.after ? { id: options.after } : (options.before) ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      where:{
        authorId : {in: authorsIds}
      },
      orderBy: [
        {
          createdAt: 'desc'
        },
        {
          id: 'asc'
        }
      ]
    })
    return posts.map(post => new PostDTO(post))
  }

  async delete (postId: string): Promise<void> {
    await this.db.post.delete({
      where: {
        id: postId
      }
    })
  }

  async getById (postId: string): Promise<ExtendedPostDTO | null> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId
      },
      include: {
        replies: true,
        author: {
          select: {
            id: true, name: true, username: true, email: true, profilePicture: true
          }
        }
      }
    })
    return post ? new ExtendedPostDTO(post) : null
  }

  async getByAuthorId (authorId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    const posts = await this.db.post.findMany({
      cursor: options.after ? { id: options.after } : (options.before) ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      where: {
        authorId
      },
      include: {
        author: {
          select: {
            id: true, name: true, username: true, email: true, profilePicture: true
          }
        },
        replies: {
          orderBy: {
            qtyTotalReactions: 'desc'
          }
        }
      },
      orderBy: {
        qtyTotalReactions: 'desc'
      }
    })
    return posts.map(post => new ExtendedPostDTO(post))
  }

  async incrementLikesCount(postId: string): Promise<void> {
    await this.db.post.update({
      where: {
        id: postId
      },
      data: {
        qtyLikes: {
          increment: 1
        },
        qtyTotalReactions: {
          increment: 1
        }
      }
    })
  }

  async incrementRetweetsCount(postId: string): Promise<void> {
    await this.db.post.update({
      where: {
        id: postId
      },
      data: {
        qtyRetweets: {
          increment: 1
        },
        qtyTotalReactions: {
          increment: 1
        }
      }
    })
  }

  async incrementRepliesCount(postId: string): Promise<void> {
    await this.db.post.update({
      where: {
        id: postId
      },
      data: {
        qtyComments: {
          increment: 1
        }
      }
    })
  }

  async getCommentsByMainPostId (postId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    const posts = await this.db.post.findMany({
      cursor: options.after ? { id: options.after } : (options.before) ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      where: {
        repliesToPostId: postId
      },
      include: {
        author: {
          select: {
            id: true, name: true, username: true, email: true, profilePicture: true
          }        
        }
      },
      orderBy: {
        qtyTotalReactions: 'desc'
      }
    })
    return(posts ? posts.map(post => new ExtendedPostDTO(post)) : [])
  }
}
