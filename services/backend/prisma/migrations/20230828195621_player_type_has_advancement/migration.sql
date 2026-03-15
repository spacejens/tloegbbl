-- CreateTable
CREATE TABLE "player_type_has_advancement" (
    "id" SERIAL NOT NULL,
    "player_type_id" INTEGER NOT NULL,
    "advancement_id" INTEGER NOT NULL,

    CONSTRAINT "player_type_has_advancement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "player_type_has_advancement_player_type_id_advancement_id_key" ON "player_type_has_advancement"("player_type_id", "advancement_id");

-- AddForeignKey
ALTER TABLE "player_type_has_advancement" ADD CONSTRAINT "player_type_has_advancement_player_type_id_fkey" FOREIGN KEY ("player_type_id") REFERENCES "player_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_type_has_advancement" ADD CONSTRAINT "player_type_has_advancement_advancement_id_fkey" FOREIGN KEY ("advancement_id") REFERENCES "advancement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
