import { FollowDTO } from "../dto";

export interface FollowService {
    follow: (followerId: string, followedId: string) => Promise<FollowDTO>
    unfollow: (followerId: string, followedId: string) => Promise<void>
    userIsFollowing: (followerId: string, followedId: string) => Promise<boolean>
    getFollowedUsersId: (followerId: string) => Promise <string[]>
}