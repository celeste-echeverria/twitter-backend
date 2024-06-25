import { FollowService } from "./follow.service";
import { FollowRepository } from "../repository";
import { BadRequestException } from "@utils";

export class FollowServiceImpl implements FollowService {
    constructor(private readonly repository: FollowRepository) {}

    async follow(followerId: string, followedId: string){
        const follow = await this.repository.getFollowByUsersId(followerId, followedId);
        if (follow) {
            throw new BadRequestException('Follow')
        }
        return await this.repository.create(followerId, followedId)
    } 

    async unfollow(followerId: string, followedId: string){
        const follow = await this.repository.getFollowByUsersId(followerId, followedId);
        if (!follow) {
            throw new BadRequestException('Unfollow')
        }
        await this.repository.delete(follow.id)
    }
}