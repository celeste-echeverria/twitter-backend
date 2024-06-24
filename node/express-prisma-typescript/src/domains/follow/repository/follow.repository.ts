import { UserDTO } from "@domains/user/dto";
import { OffsetPagination } from "@types";
import { FollowDTO } from "../dto";

export interface FollowRepository {
    follow: (followerId: string, followeeId: string) => Promise<FollowDTO>;
    unfollow: (followerId: string, followeeId: string) => Promise<void>;
    getFollowers: (userId: string, options: OffsetPagination) => Promise<UserDTO[]>;
    getFollowing: (userId: string, options: OffsetPagination) => Promise<UserDTO[]>;
    isFollowing: (followerId: string, followeeId: string) => Promise<boolean>;
} 