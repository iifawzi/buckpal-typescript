-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "localDateTime" TIMESTAMP(3) NOT NULL,
    "ownerAccountId" INTEGER NOT NULL,
    "sourceAccountId" INTEGER NOT NULL,
    "targetAccountId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);
