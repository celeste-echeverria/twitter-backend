-- CreateTable
CREATE TABLE "ReactionType" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "typeName" TEXT NOT NULL,

    CONSTRAINT "ReactionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reaction" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "reactionTypeId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReactionType_typeName_key" ON "ReactionType"("typeName");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_postId_reactionTypeId_key" ON "Reaction"("userId", "postId", "reactionTypeId");

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_reactionTypeId_fkey" FOREIGN KEY ("reactionTypeId") REFERENCES "ReactionType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
