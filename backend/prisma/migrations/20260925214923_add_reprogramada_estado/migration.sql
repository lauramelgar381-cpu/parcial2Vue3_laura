/*
  Warnings:

  - The values [COMPLETADA] on the enum `EstadoCita` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EstadoCita_new" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'REPROGRAMADA');
ALTER TABLE "public"."citas" ALTER COLUMN "estado" DROP DEFAULT;
ALTER TABLE "citas" ALTER COLUMN "estado" TYPE "EstadoCita_new" USING ("estado"::text::"EstadoCita_new");
ALTER TYPE "EstadoCita" RENAME TO "EstadoCita_old";
ALTER TYPE "EstadoCita_new" RENAME TO "EstadoCita";
DROP TYPE "public"."EstadoCita_old";
ALTER TABLE "citas" ALTER COLUMN "estado" SET DEFAULT 'PENDIENTE';
COMMIT;
