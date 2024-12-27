-- CreateTable
CREATE TABLE "match" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "competition_id" INTEGER NOT NULL,
    "played_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_match_id" (
    "id" SERIAL NOT NULL,
    "external_id" TEXT NOT NULL,
    "external_system" TEXT NOT NULL,
    "match_id" INTEGER NOT NULL,

    CONSTRAINT "external_match_id_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_in_match" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "match_id" INTEGER NOT NULL,

    CONSTRAINT "team_in_match_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "external_match_id_external_id_external_system_key" ON "external_match_id"("external_id", "external_system");

-- CreateIndex
CREATE UNIQUE INDEX "team_in_match_team_id_match_id_key" ON "team_in_match"("team_id", "match_id");

-- AddForeignKey
ALTER TABLE "match" ADD CONSTRAINT "match_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_match_id" ADD CONSTRAINT "external_match_id_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_in_match" ADD CONSTRAINT "team_in_match_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_in_match" ADD CONSTRAINT "team_in_match_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
