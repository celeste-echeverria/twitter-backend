import { PrismaClient } from "@prisma/client";
import { FollowRepository } from "./follow.repository";
import { UserDTO } from "@domains/user/dto";
import { OffsetPagination } from "@types";
import { FollowDTO } from "../dto";


export class FollowRepositoryImpl implements FollowRepository{
    constructor (private readonly db: PrismaClient) {}

    async follow(followerId: string, followedId: string): Promise<FollowDTO> {
        const follow = await this.db.follow.create({
            data: {
                followerId,
                followedId
            },
        });
        return new FollowDTO(follow)
    }
    
    async unfollow(followerId: string, followedId: string): Promise<void> {
        const follow = await this.db.follow.findFirst({
            where: {
                followerId: followerId,
                followedId: followedId,
            },
        });
    
        if (follow) {
            await this.db.follow.delete({
                where: {
                    id: follow.id,
                },
            });
        }
      }
    
    async getFollowers(userId: string, options: OffsetPagination): Promise<UserDTO[]> {
        const followers = await this.db.follow.findMany({
          where: { followedId: userId },
          include: { follower: true },
          take: options.limit,
          skip: options.skip,
          orderBy: [{ createdAt: 'desc' }],
        });
    
        return followers.map(follow => new UserDTO(follow.follower));
    }
    
    async getFollowing(userId: string, options: OffsetPagination): Promise<UserDTO[]> {
        const following = await this.db.follow.findMany({
          where: { followerId: userId },
          include: { followed: true },
          take: options.limit,
          skip: options.skip,
          orderBy: [{ createdAt: 'desc' }],
        });
    
        return following.map(follow => new UserDTO(follow.followed));
    }
    
    async isFollowing(followerId: string, followedId: string): Promise<boolean> {
        const follow = await this.db.follow.findFirst({
            where: {
                followerId: followerId,
                followedId: followedId,
            },
        });
    
        return follow !== null;
    }

}