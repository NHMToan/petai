CREATE TYPE "PetMessageRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM');
CREATE TYPE "PetMemoryKind" AS ENUM ('PROFILE', 'PREFERENCE', 'RELATIONSHIP', 'ROUTINE', 'FACT');

CREATE TABLE "PetConversation" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "summary" TEXT NOT NULL DEFAULT '',
    "lastMessageAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PetConversation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PetMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" "PetMessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "model" TEXT,
    "metadata" JSONB,
    "inputTokens" INTEGER,
    "outputTokens" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PetMessage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PetMemory" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "PetMemoryKind" NOT NULL,
    "content" TEXT NOT NULL,
    "importance" INTEGER NOT NULL DEFAULT 1,
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PetMemory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PetPromptProfile" (
    "petId" TEXT NOT NULL,
    "persona" TEXT NOT NULL DEFAULT '',
    "speakingStyle" TEXT NOT NULL DEFAULT '',
    "boundaries" TEXT NOT NULL DEFAULT '',
    "backstory" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PetPromptProfile_pkey" PRIMARY KEY ("petId")
);

CREATE UNIQUE INDEX "PetConversation_petId_userId_key" ON "PetConversation"("petId", "userId");
CREATE INDEX "PetConversation_petId_userId_lastMessageAt_idx" ON "PetConversation"("petId", "userId", "lastMessageAt");
CREATE INDEX "PetMessage_conversationId_createdAt_idx" ON "PetMessage"("conversationId", "createdAt");
CREATE INDEX "PetMemory_petId_userId_importance_idx" ON "PetMemory"("petId", "userId", "importance");

ALTER TABLE "PetConversation" ADD CONSTRAINT "PetConversation_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PetConversation" ADD CONSTRAINT "PetConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PetMessage" ADD CONSTRAINT "PetMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "PetConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PetMemory" ADD CONSTRAINT "PetMemory_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PetMemory" ADD CONSTRAINT "PetMemory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PetPromptProfile" ADD CONSTRAINT "PetPromptProfile_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
