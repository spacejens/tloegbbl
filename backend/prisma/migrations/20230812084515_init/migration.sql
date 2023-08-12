-- CreateTable
CREATE TABLE "Coach" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Coach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalCoachId" (
    "id" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "externalSystem" TEXT NOT NULL,
    "coachId" INTEGER NOT NULL,

    CONSTRAINT "ExternalCoachId_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExternalCoachId_externalId_externalSystem_key" ON "ExternalCoachId"("externalId", "externalSystem");

-- AddForeignKey
ALTER TABLE "ExternalCoachId" ADD CONSTRAINT "ExternalCoachId_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Coach"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
