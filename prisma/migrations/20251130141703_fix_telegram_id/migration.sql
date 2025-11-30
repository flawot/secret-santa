-- AlterTable
ALTER TABLE "connections" ALTER COLUMN "giver_id" SET DATA TYPE BIGINT,
ALTER COLUMN "recipient_id" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "members" ALTER COLUMN "telegram" SET DATA TYPE BIGINT;
