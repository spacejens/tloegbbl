-- CreateTable
CREATE TABLE "competition" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "competition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_competition_id" (
    "id" SERIAL NOT NULL,
    "external_id" TEXT NOT NULL,
    "external_system" TEXT NOT NULL,
    "competition_id" INTEGER NOT NULL,

    CONSTRAINT "external_competition_id_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "external_competition_id_external_id_external_system_key" ON "external_competition_id"("external_id", "external_system");

-- AddForeignKey
ALTER TABLE "external_competition_id" ADD CONSTRAINT "external_competition_id_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
