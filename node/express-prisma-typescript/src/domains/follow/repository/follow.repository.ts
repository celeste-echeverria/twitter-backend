import { UserDTO } from "@domains/user/dto";
import { FollowDTO } from "../dto";

export interface FollowRepository {
    create: (followerId: string, followedId: string) => Promise<FollowDTO>
    delete: (followId: string,) => Promise<void>
    getFollowers: (userId: string) => Promise<UserDTO[]>
    getFollowing: (userId: string) => Promise<UserDTO[]>
    getFollowedUsersIds: (userId: string) => Promise<string[]>
    isFollowing: (followerId: string, followedId: string) => Promise<boolean>
    getFollowByUsersId: (followerId: string, followedId: string) => Promise<FollowDTO | null>
    getMutualFollowersByUserId: (userId: string) => Promise <UserDTO[]>
} 