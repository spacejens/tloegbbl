-- CreateTable
CREATE TABLE "player" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "team_id" INTEGER NOT NULL,

    CONSTRAINT "player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_player_id" (
    "id" SERIAL NOT NULL,
    "external_id" TEXT NOT NULL,
    "external_system" TEXT NOT NULL,
    "player_id" INTEGER NOT NULL,

    CONSTRAINT "external_player_id_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "external_player_id_external_id_external_system_key" ON "external_player_id"("external_id", "external_system");

-- AddForeignKey
ALTER TABLE "player" ADD CONSTRAINT "player_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_player_id" ADD CONSTRAINT "external_player_id_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
