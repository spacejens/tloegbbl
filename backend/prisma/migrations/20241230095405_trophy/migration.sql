-- CreateEnum
CREATE TYPE "TrophyCategory" AS ENUM ('TEAM_TROPHY', 'PLAYER_TROPHY');

-- CreateTable
CREATE TABLE "trophy" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "trophy_category" "TrophyCategory" NOT NULL,

    CONSTRAINT "trophy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_trophy_id" (
    "id" SERIAL NOT NULL,
    "external_id" TEXT NOT NULL,
    "external_system" TEXT NOT NULL,
    "trophy_id" INTEGER NOT NULL,

    CONSTRAINT "external_trophy_id_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "external_trophy_id_external_id_external_system_key" ON "external_trophy_id"("external_id", "external_system");

-- AddForeignKey
ALTER TABLE "external_trophy_id" ADD CONSTRAINT "external_trophy_id_trophy_id_fkey" FOREIGN KEY ("trophy_id") REFERENCES "trophy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
