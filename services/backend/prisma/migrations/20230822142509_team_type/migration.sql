-- CreateTable
CREATE TABLE "team_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "team_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_team_type_id" (
    "id" SERIAL NOT NULL,
    "external_id" TEXT NOT NULL,
    "external_system" TEXT NOT NULL,
    "team_type_id" INTEGER NOT NULL,

    CONSTRAINT "external_team_type_id_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "external_team_type_id_external_id_external_system_key" ON "external_team_type_id"("external_id", "external_system");

-- AddForeignKey
ALTER TABLE "external_team_type_id" ADD CONSTRAINT "external_team_type_id_team_type_id_fkey" FOREIGN KEY ("team_type_id") REFERENCES "team_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
