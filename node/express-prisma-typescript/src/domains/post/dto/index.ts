import { ArrayMaxSize, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import { UserViewDTO } from '@domains/user/dto'
import { ReactionDTO } from '@domains/reaction/dto'

export class CreatePostInputDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
    content!: string

  @IsOptional()
  @ArrayMaxSize(4)
    images?: string[]
}

export class PostDTO {
  constructor (post: PostDTO) {
    this.id = post.id
    this.authorId = post.authorId
    this.content = post.content
    this.images = post.images
    this.createdAt = post.createdAt
    this.parentId = post.parentId 
    this.comments = post.comments ? post.comments.map(comment => new PostDTO(comment)) : [];
    this.reactions = post.reactions ? post.reactions.map(reaction => new ReactionDTO(reaction)) : [];
  }

  id: string
  authorId: string
  content: string
  images?: string[]
  createdAt: Date
  parentId: string | null
  comments?: PostDTO[]
  reactions?: ReactionDTO[]
}

export class ExtendedPostDTO extends PostDTO {
  constructor (post: ExtendedPostDTO) {
    super(post)
    this.author = post.author
    this.qtyComments = post.qtyComments
    this.qtyLikes = post.qtyLikes
    this.qtyRetweets = post.qtyRetweets
    this.images = post.images
  }

  author!: UserViewDTO
  qtyComments!: number
  qtyLikes!: number
  qtyRetweets!: number
}
