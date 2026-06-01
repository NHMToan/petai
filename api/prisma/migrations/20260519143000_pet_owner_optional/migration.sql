-- Allow pets to be provisioned by admins before they are claimed by an end user.
ALTER TABLE "Pet" ALTER COLUMN "userId" DROP NOT NULL;
