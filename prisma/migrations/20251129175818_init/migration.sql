-- CreateTable
CREATE TABLE "members" (
    "id" SERIAL NOT NULL,
    "telegram" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "connections" (
    "id" SERIAL NOT NULL,
    "giver_id" INTEGER NOT NULL,
    "recipient_id" INTEGER NOT NULL,

    CONSTRAINT "connections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_telegram_key" ON "members"("telegram");
