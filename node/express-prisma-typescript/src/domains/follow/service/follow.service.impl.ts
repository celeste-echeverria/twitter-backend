import { FollowService } from "./follow.service";
import { FollowRepository, FollowRepositoryImpl } from "../repository";
import { BadRequestException, ConflictException, db, InternalServerErrorException } from "@utils";
import { FollowDTO } from "../dto";
import { UserDTO } from "@domains/user/dto";

export class FollowServiceImpl implements FollowService {
    constructor(private readonly repository: FollowRepository = new FollowRepositoryImpl(db)) {}

    async follow(followerId: string, followedId: string): Promise <FollowDTO>{
        try{
            const follow = await this.repository.getFollowByUsersId(followerId, followedId)
            if (followerId == followedId) throw new ConflictException('CANNOT_FOLLOW_SELF')
            if (follow) throw new ConflictException('ALREADY_FOLLOWING_USER')

            return await this.repository.create(followerId, followedId)

        } catch (error) {
            if (error instanceof ConflictException) throw error
            throw new InternalServerErrorException("follow")
        }
    } 

    async unfollow(followerId: string, followedId: string): Promise<void>{
        try {
            const follow = await this.repository.getFollowByUsersId(followerId, followedId)
            if (followerId == followedId) throw new ConflictException('CANNOT_UNFOLLOW_SELF')
            if (!follow) throw new ConflictException('NOT_FOLLOWING_USER')

            await this.repository.delete(follow.id)
        } catch (error) {
            if (error instanceof ConflictException) throw error
            throw new InternalServerErrorException("unfollow")
        }
    }

    async userIsFollowing(followerId: string, followedId: string): Promise<boolean> {
        try {
           return await this.repository.isFollowing(followerId, followedId)
        } catch (error) {
            throw new InternalServerErrorException("userIsFollowing")
        }
    }

    async getFollowedUsersId(followerId: string): Promise <string[]>{
        try {
            return await this.repository.getFollowedUsersIds(followerId)
        } catch (error) {
            throw new InternalServerErrorException("getFollowedUsersId")
        }
    }

    async getFollowersByUserId(userId: string): Promise <UserDTO[]> {
        try {
            return await this.repository.getFollowers(userId)
        } catch (error) {
            throw new InternalServerErrorException("getFollowerByUserId")
        }
    }

    async getFollowingByUserId(userId: string): Promise <UserDTO[]> {
        try {
            return await this.repository.getFollowing(userId)
        } catch (error) {
            throw new InternalServerErrorException("getFollowingByUserId")
        }
    }
}