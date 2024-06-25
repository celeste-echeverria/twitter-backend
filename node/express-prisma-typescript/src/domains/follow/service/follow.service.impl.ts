import { FollowService } from "./follow.service";
import { FollowRepository } from "../repository";
import { NotFoundException } from "@utils";

export class FollowServiceImpl implements FollowService {
    constructor(private readonly repository: FollowRepository) {}

    async follow(followerId: string, followedId: string){
        return await this.repository.create(followerId, followedId)
    } 

    async unfollow(followerId: string, followedId: string){
        const follow = await this.repository.getFollowByUsersId(followerId, followedId);
        if (follow) {
            await this.repository.delete(follow.id)
        } else {
            throw new NotFoundException('follow')
        }
    }

}