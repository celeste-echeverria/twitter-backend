import { UserDTO } from "@domains/user/dto";
import { FollowDTO } from "../dto";

export interface FollowService {
    follow: (followerId: string, followedId: string) => Promise<FollowDTO>
    unfollow: (followerId: string, followedId: string) => Promise<void>
    userIsFollowing: (followerId: string, followedId: string) => Promise<boolean>
    getFollowedUsersId: (followerId: string) => Promise <string[]>
    getFollowersByUserId: (userId: string) => Promise <UserDTO[]>
    getFollowingByUserId: (userId: string) => Promise <UserDTO[]>
    getMutualsIds: (userId: string) => Promise <string[]>
    getMutuals: (userId: string) => Promise <UserDTO[]>
}