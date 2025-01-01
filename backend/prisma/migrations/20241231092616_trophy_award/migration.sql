-- CreateTable
CREATE TABLE "trophy_award" (
    "id" SERIAL NOT NULL,
    "trophy_id" INTEGER NOT NULL,
    "competition_id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,
    "player_id" INTEGER,

    CONSTRAINT "trophy_award_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trophy_award_trophy_id_competition_id_team_id_player_id_key" ON "trophy_award"("trophy_id", "competition_id", "team_id", "player_id");

-- AddForeignKey
ALTER TABLE "trophy_award" ADD CONSTRAINT "trophy_award_trophy_id_fkey" FOREIGN KEY ("trophy_id") REFERENCES "trophy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trophy_award" ADD CONSTRAINT "trophy_award_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trophy_award" ADD CONSTRAINT "trophy_award_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trophy_award" ADD CONSTRAINT "trophy_award_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
