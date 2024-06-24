import { UserDTO } from "@domains/user/dto";
import { OffsetPagination } from "@types";
import { FollowDTO } from "../dto";

export interface FollowRepository {
    follow: (followerId: string, followedId: string) => Promise<FollowDTO>;
    unfollow: (followerId: string, followedId: string) => Promise<void>;
    getFollowers: (userId: string, options: OffsetPagination) => Promise<UserDTO[]>;
    getFollowing: (userId: string, options: OffsetPagination) => Promise<UserDTO[]>;
    isFollowing: (followerId: string, followedId: string) => Promise<boolean>;
} 