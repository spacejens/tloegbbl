-- CreateTable
CREATE TABLE "match_event" (
    "id" SERIAL NOT NULL,
    "match_id" INTEGER NOT NULL,
    "acting_team_id" INTEGER,
    "acting_player_id" INTEGER,
    "consequence_team_id" INTEGER,
    "consequence_player_id" INTEGER,

    CONSTRAINT "match_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_match_event_id" (
    "id" SERIAL NOT NULL,
    "external_id" TEXT NOT NULL,
    "external_system" TEXT NOT NULL,
    "match_event_id" INTEGER NOT NULL,

    CONSTRAINT "external_match_event_id_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "external_match_event_id_external_id_external_system_key" ON "external_match_event_id"("external_id", "external_system");

-- AddForeignKey
ALTER TABLE "match_event" ADD CONSTRAINT "match_event_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_event" ADD CONSTRAINT "match_event_acting_team_id_fkey" FOREIGN KEY ("acting_team_id") REFERENCES "team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_event" ADD CONSTRAINT "match_event_acting_player_id_fkey" FOREIGN KEY ("acting_player_id") REFERENCES "player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_event" ADD CONSTRAINT "match_event_consequence_team_id_fkey" FOREIGN KEY ("consequence_team_id") REFERENCES "team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_event" ADD CONSTRAINT "match_event_consequence_player_id_fkey" FOREIGN KEY ("consequence_player_id") REFERENCES "player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_match_event_id" ADD CONSTRAINT "external_match_event_id_match_event_id_fkey" FOREIGN KEY ("match_event_id") REFERENCES "match_event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
