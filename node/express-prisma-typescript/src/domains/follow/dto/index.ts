export class FollowDTO {

    constructor(follow: FollowDTO){
        this.id = follow.id
        this.followerId = follow.followerId
        this.followedId = follow.followedId
        this.createdAt = follow.createdAt
    }

    id: string
    followerId: string
    followedId: string
    createdAt: Date

}


/*
model Follow {
  id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid // Primary Key

  followerId String @db.Uuid()
  followedId String @db.Uuid()

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime? // Optional value

  follower User @relation(name: "follows", fields: [followerId], references: [id], onDelete: Cascade) // One to many
  followed User @relation(name: "followers", fields: [followedId], references: [id], onDelete: Cascade) // One to many
}
  */