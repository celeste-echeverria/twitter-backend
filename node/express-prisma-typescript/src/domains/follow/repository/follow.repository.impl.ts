import { PrismaClient } from "@prisma/client";
import { FollowRepository } from "./follow.repository";
import { UserDTO } from "@domains/user/dto";
import { FollowDTO } from "../dto";


export class FollowRepositoryImpl implements FollowRepository{
    constructor (private readonly db: PrismaClient) {}

    async create(followerId: string, followedId: string): Promise<FollowDTO> {
        const follow = await this.db.follow.create({
            data: {
                followerId,
                followedId
            },
        });
        return new FollowDTO(follow)
    }
    
    async delete(followId: string): Promise<void> {
        await this.db.follow.delete({
            where: {
                id: followId,
            },
        });
    }
    
    async getFollowers(userId: string): Promise<UserDTO[]> {
        const followers = await this.db.follow.findMany({
          where: { followedId: userId },
          include: { follower: true },
          orderBy: [{ createdAt: 'desc' }],
        });
    
        return followers.map(follow => new UserDTO(follow.follower));
    }

    async getFollowingData(userId: string) : Promise<any[]>{
        const data =  await this.db.follow.findMany({
            where: { followerId: userId },
            include: { followed: true },
            orderBy: [{ createdAt: 'desc' }],
        });
        return data
    }
    
    async getFollowing(userId: string): Promise<UserDTO[]> {
        const following = await this.getFollowingData(userId);
        return following.map(follow => new UserDTO(follow.followed));
    }
    
    async getFollowedUsersIds(userId: string): Promise<string[]> {
        const following = await this.getFollowingData(userId);
        return following.map(follow => follow.followedId);
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

    async getFollowByUsersId(followerId: string, followedId: string): Promise <FollowDTO | null>{
        const follow = await this.db.follow.findFirst({
            where: {
                followerId: followerId,
                followedId: followedId
            }
        })
        return (follow != null) ? new FollowDTO(follow) : null
    }

    async getMutualFollowersByUserId(userId: string): Promise <UserDTO[]> {
        const mutuals = await this.db.user.findMany({
            where: {
              AND: [
                {
                  follows: {
                    some: {
                      followedId: userId,
                    },
                  },
                },
                {
                  followers: {
                    some: {
                      followerId: userId,
                    },
                  },
                },
              ],
            },
        });
        return mutuals.map(mutual => new UserDTO(mutual))
    }
    
    async areMutualFollowers(userId: string, otherUserId: string): Promise <boolean>{
        const follow1 = await this.db.follow.findUnique({
            where: {
              followerId_followedId: {
                followerId: userId,
                followedId: otherUserId,
              },
            },
          });
      
          const follow2 = await this.db.follow.findUnique({
            where: {
              followerId_followedId: {
                followerId: otherUserId,
                followedId: userId,
              },
            },
          });
      
          return follow1 !== null && follow2 !== null;
    }

}