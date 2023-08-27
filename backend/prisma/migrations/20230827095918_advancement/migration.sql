-- CreateTable
CREATE TABLE "advancement" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "advancement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_advancement_id" (
    "id" SERIAL NOT NULL,
    "external_id" TEXT NOT NULL,
    "external_system" TEXT NOT NULL,
    "advancement_id" INTEGER NOT NULL,

    CONSTRAINT "external_advancement_id_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_has_advancement" (
    "id" SERIAL NOT NULL,
    "player_id" INTEGER NOT NULL,
    "advancement_id" INTEGER NOT NULL,

    CONSTRAINT "player_has_advancement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "external_advancement_id_external_id_external_system_key" ON "external_advancement_id"("external_id", "external_system");

-- CreateIndex
CREATE UNIQUE INDEX "player_has_advancement_player_id_advancement_id_key" ON "player_has_advancement"("player_id", "advancement_id");

-- AddForeignKey
ALTER TABLE "external_advancement_id" ADD CONSTRAINT "external_advancement_id_advancement_id_fkey" FOREIGN KEY ("advancement_id") REFERENCES "advancement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_has_advancement" ADD CONSTRAINT "player_has_advancement_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_has_advancement" ADD CONSTRAINT "player_has_advancement_advancement_id_fkey" FOREIGN KEY ("advancement_id") REFERENCES "advancement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
