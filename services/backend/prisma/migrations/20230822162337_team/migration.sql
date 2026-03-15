-- CreateTable
CREATE TABLE "team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "head_coach_id" INTEGER NOT NULL,
    "co_coach_id" INTEGER,
    "team_type_id" INTEGER NOT NULL,

    CONSTRAINT "team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_team_id" (
    "id" SERIAL NOT NULL,
    "external_id" TEXT NOT NULL,
    "external_system" TEXT NOT NULL,
    "team_id" INTEGER NOT NULL,

    CONSTRAINT "external_team_id_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "external_team_id_external_id_external_system_key" ON "external_team_id"("external_id", "external_system");

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_head_coach_id_fkey" FOREIGN KEY ("head_coach_id") REFERENCES "coach"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_co_coach_id_fkey" FOREIGN KEY ("co_coach_id") REFERENCES "coach"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_team_type_id_fkey" FOREIGN KEY ("team_type_id") REFERENCES "team_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_team_id" ADD CONSTRAINT "external_team_id_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
