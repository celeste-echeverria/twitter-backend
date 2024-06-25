import { FollowDTO } from "../dto";

export interface FollowService {
    follow: (followerId: string, followedId: string) => Promise<FollowDTO>
    unfollow: (followerId: string, followedId: string) => Promise<void>
}