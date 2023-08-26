/*
  Warnings:

  - Added the required column `player_type_id` to the `player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "player" ADD COLUMN     "player_type_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "player_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "player_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_player_type_id" (
    "id" SERIAL NOT NULL,
    "external_id" TEXT NOT NULL,
    "external_system" TEXT NOT NULL,
    "player_type_id" INTEGER NOT NULL,

    CONSTRAINT "external_player_type_id_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "external_player_type_id_external_id_external_system_key" ON "external_player_type_id"("external_id", "external_system");

-- AddForeignKey
ALTER TABLE "external_player_type_id" ADD CONSTRAINT "external_player_type_id_player_type_id_fkey" FOREIGN KEY ("player_type_id") REFERENCES "player_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player" ADD CONSTRAINT "player_player_type_id_fkey" FOREIGN KEY ("player_type_id") REFERENCES "player_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
