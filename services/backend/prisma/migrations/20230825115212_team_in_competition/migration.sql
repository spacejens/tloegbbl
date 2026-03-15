-- CreateTable
CREATE TABLE "team_in_competition" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "competition_id" INTEGER NOT NULL,

    CONSTRAINT "team_in_competition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "team_in_competition_team_id_competition_id_key" ON "team_in_competition"("team_id", "competition_id");

-- AddForeignKey
ALTER TABLE "team_in_competition" ADD CONSTRAINT "team_in_competition_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_in_competition" ADD CONSTRAINT "team_in_competition_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
