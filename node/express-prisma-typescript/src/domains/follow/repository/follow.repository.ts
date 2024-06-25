import { UserDTO } from "@domains/user/dto";
import { OffsetPagination } from "@types";
import { FollowDTO } from "../dto";

export interface FollowRepository {
    create: (followerId: string, followedId: string) => Promise<FollowDTO>;
    delete: (followId: string,) => Promise<void>;
    getFollowers: (userId: string, options: OffsetPagination) => Promise<UserDTO[]>;
    getFollowing: (userId: string, options: OffsetPagination) => Promise<UserDTO[]>;
    isFollowing: (followerId: string, followedId: string) => Promise<boolean>;
    getFollowByUsersId: (followerId: string, followedId: string) => Promise<FollowDTO | null>;
} 