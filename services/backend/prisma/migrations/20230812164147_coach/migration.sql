-- CreateTable
CREATE TABLE "coach" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "coach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_coach_id" (
    "id" SERIAL NOT NULL,
    "external_id" TEXT NOT NULL,
    "external_system" TEXT NOT NULL,
    "coach_id" INTEGER NOT NULL,

    CONSTRAINT "external_coach_id_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "external_coach_id_external_id_external_system_key" ON "external_coach_id"("external_id", "external_system");

-- AddForeignKey
ALTER TABLE "external_coach_id" ADD CONSTRAINT "external_coach_id_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "coach"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
