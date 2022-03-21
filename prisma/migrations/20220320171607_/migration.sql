-- CreateTable
CREATE TABLE "creator_details" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "verificated" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "creator_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "creator_details_userId_key" ON "creator_details"("userId");

-- AddForeignKey
ALTER TABLE "creator_details" ADD CONSTRAINT "creator_details_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
