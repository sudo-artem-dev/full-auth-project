-- AlterTable
ALTER TABLE "User" ADD COLUMN     "trustedDevices" TEXT[] DEFAULT ARRAY[]::TEXT[];
