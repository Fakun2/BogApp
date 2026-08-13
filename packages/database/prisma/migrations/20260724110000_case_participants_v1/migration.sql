DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CaseParticipantKind') THEN
    CREATE TYPE "CaseParticipantKind" AS ENUM ('client', 'opposing_party', 'third_party', 'other');
  END IF;
END $$;

ALTER TABLE "case_participants"
ADD COLUMN IF NOT EXISTS "participant_kind" "CaseParticipantKind" NOT NULL DEFAULT 'other';

ALTER TABLE "case_participants"
ADD COLUMN IF NOT EXISTS "notes" TEXT;

ALTER TABLE "case_participants"
RENAME COLUMN "name" TO "display_name";
