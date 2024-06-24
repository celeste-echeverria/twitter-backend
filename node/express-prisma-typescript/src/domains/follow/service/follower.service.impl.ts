import { PrismaClient } from "@prisma/client";
import { FollowService } from "./follower.service";
import { FollowRepository } from "../repository";

export class FollowServiceImpl implements FollowService {
    constructor(private readonly repository: FollowRepository) {}

}