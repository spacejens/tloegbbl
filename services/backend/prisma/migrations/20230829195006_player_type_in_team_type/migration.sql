-- CreateTable
CREATE TABLE "player_type_in_team_type" (
    "id" SERIAL NOT NULL,
    "player_type_id" INTEGER NOT NULL,
    "team_type_id" INTEGER NOT NULL,

    CONSTRAINT "player_type_in_team_type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "player_type_in_team_type_player_type_id_team_type_id_key" ON "player_type_in_team_type"("player_type_id", "team_type_id");

-- AddForeignKey
ALTER TABLE "player_type_in_team_type" ADD CONSTRAINT "player_type_in_team_type_player_type_id_fkey" FOREIGN KEY ("player_type_id") REFERENCES "player_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_type_in_team_type" ADD CONSTRAINT "player_type_in_team_type_team_type_id_fkey" FOREIGN KEY ("team_type_id") REFERENCES "team_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
