import { FollowService } from "./follow.service";
import { FollowRepository, FollowRepositoryImpl } from "../repository";
import { BadRequestException, db } from "@utils";
import { FollowDTO } from "../dto";

export class FollowServiceImpl implements FollowService {
    constructor(private readonly repository: FollowRepository = new FollowRepositoryImpl(db)) {}

    async follow(followerId: string, followedId: string): Promise <FollowDTO>{
        const follow = await this.repository.getFollowByUsersId(followerId, followedId);
        if (follow) {
            throw new BadRequestException('Follow')
        }
        return await this.repository.create(followerId, followedId)
    } 

    async unfollow(followerId: string, followedId: string): Promise<void>{
        const follow = await this.repository.getFollowByUsersId(followerId, followedId);
        if (!follow) {
            throw new BadRequestException('Unfollow')
        }
        await this.repository.delete(follow.id)
    }

    async userIsFollowing(followerId: string, followedId: string): Promise<boolean> {
        console.log('follower', followerId,  'follows', followedId)
        return await this.repository.isFollowing(followerId, followedId)
    }

    async getFollowedUsersId(followerId: string): Promise <string[]>{
        return await this.repository.getFollowedUsersIds(followerId)
    }
}