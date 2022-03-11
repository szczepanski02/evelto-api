-- CreateTable
CREATE TABLE "IPRequest" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "employeeId" INTEGER NOT NULL,

    CONSTRAINT "IPRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificatedIP" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "employeeId" INTEGER NOT NULL,

    CONSTRAINT "VerificatedIP_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IPRequest" ADD CONSTRAINT "IPRequest_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificatedIP" ADD CONSTRAINT "VerificatedIP_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
