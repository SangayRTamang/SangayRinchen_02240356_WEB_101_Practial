-- Rename the table
ALTER TABLE "Video" RENAME TO "videos";

-- Rename existing columns
ALTER TABLE "videos" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "videos" RENAME COLUMN "videoUrl" TO "video_url";
ALTER TABLE "videos" RENAME COLUMN "thumbnail" TO "thumbnail_url";
ALTER TABLE "videos" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "videos" RENAME COLUMN "title" TO "caption";

-- Make caption nullable
ALTER TABLE "videos" ALTER COLUMN "caption" DROP NOT NULL;

-- Add new columns
ALTER TABLE "videos" ADD COLUMN IF NOT EXISTS "audio_name" TEXT;
ALTER TABLE "videos" ADD COLUMN IF NOT EXISTS "video_storage_path" TEXT;
ALTER TABLE "videos" ADD COLUMN IF NOT EXISTS "thumbnail_storage_path" TEXT;
ALTER TABLE "videos" ADD COLUMN IF NOT EXISTS "views" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "videos" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Drop old foreign keys
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_videoId_fkey";
ALTER TABLE "Video" DROP CONSTRAINT "Video_userId_fkey";
ALTER TABLE "VideoLike" DROP CONSTRAINT "VideoLike_videoId_fkey";

-- Add new foreign keys
ALTER TABLE "videos" ADD CONSTRAINT "videos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "videos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "VideoLike" ADD CONSTRAINT "VideoLike_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "videos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;