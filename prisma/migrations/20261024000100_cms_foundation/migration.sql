CREATE TYPE "Role" AS ENUM ('OWNER', 'EDITOR', 'VIEWER');
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'QUALIFIED', 'DISCOVERY_SCHEDULED', 'PROPOSAL_SENT', 'WON', 'LOST');
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED');

CREATE TABLE "User" ("id" TEXT NOT NULL, "name" TEXT, "email" TEXT NOT NULL, "password" TEXT, "role" "Role" NOT NULL DEFAULT 'VIEWER', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "User_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Lead" ("id" TEXT NOT NULL, "name" TEXT NOT NULL, "email" TEXT NOT NULL, "company" TEXT NOT NULL, "website" TEXT, "serviceRequested" TEXT NOT NULL, "challenge" TEXT NOT NULL, "timeline" TEXT NOT NULL, "budget" TEXT, "leadSource" TEXT, "consentAt" TIMESTAMP(3) NOT NULL, "status" "LeadStatus" NOT NULL DEFAULT 'NEW', "notes" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Lead_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Service" ("id" TEXT NOT NULL, "slug" TEXT NOT NULL, "title" TEXT NOT NULL, "shortDescription" TEXT NOT NULL, "fullDescription" TEXT NOT NULL, "targetAudience" TEXT NOT NULL, "problemsSolved" TEXT[], "deliverables" TEXT[], "engagementProcess" TEXT[], "ctaText" TEXT NOT NULL, "price" TEXT, "metaTitle" TEXT, "metaDescription" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "isPublished" BOOLEAN NOT NULL DEFAULT true, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Service_pkey" PRIMARY KEY ("id"));
CREATE TABLE "BlogPost" ("id" TEXT NOT NULL, "slug" TEXT NOT NULL, "title" TEXT NOT NULL, "excerpt" TEXT NOT NULL, "content" TEXT NOT NULL, "category" TEXT NOT NULL, "featuredImage" TEXT, "status" "PostStatus" NOT NULL DEFAULT 'DRAFT', "publishedAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id"));
CREATE TABLE "BlogPostVersion" ("id" TEXT NOT NULL, "blogPostId" TEXT NOT NULL, "version" INTEGER NOT NULL, "title" TEXT NOT NULL, "excerpt" TEXT NOT NULL, "content" TEXT NOT NULL, "category" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "BlogPostVersion_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Page" ("id" TEXT NOT NULL, "slug" TEXT NOT NULL, "title" TEXT NOT NULL, "content" JSONB NOT NULL, "metaTitle" TEXT, "metaDescription" TEXT, "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT', "publishedAt" TIMESTAMP(3), "scheduledAt" TIMESTAMP(3), "isPublished" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Page_pkey" PRIMARY KEY ("id"));
CREATE TABLE "PageVersion" ("id" TEXT NOT NULL, "pageId" TEXT NOT NULL, "version" INTEGER NOT NULL, "title" TEXT NOT NULL, "content" JSONB NOT NULL, "metaTitle" TEXT, "metaDescription" TEXT, "createdById" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PageVersion_pkey" PRIMARY KEY ("id"));
CREATE TABLE "MediaAsset" ("id" TEXT NOT NULL, "url" TEXT NOT NULL, "storageKey" TEXT NOT NULL, "filename" TEXT NOT NULL, "altText" TEXT NOT NULL, "mimeType" TEXT NOT NULL, "size" INTEGER NOT NULL, "uploadedById" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id"));
CREATE TABLE "SiteSetting" ("id" TEXT NOT NULL, "key" TEXT NOT NULL, "value" JSONB NOT NULL, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id"));
CREATE TABLE "AuditEvent" ("id" TEXT NOT NULL, "actorId" TEXT, "action" TEXT NOT NULL, "target" TEXT NOT NULL, "metadata" JSONB, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id"));
CREATE TABLE "PasswordResetToken" ("id" TEXT NOT NULL, "tokenHash" TEXT NOT NULL, "userId" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL, "usedAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id"));

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");
CREATE UNIQUE INDEX "BlogPostVersion_blogPostId_version_key" ON "BlogPostVersion"("blogPostId", "version");
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");
CREATE INDEX "PageVersion_pageId_createdAt_idx" ON "PageVersion"("pageId", "createdAt");
CREATE UNIQUE INDEX "PageVersion_pageId_version_key" ON "PageVersion"("pageId", "version");
CREATE UNIQUE INDEX "MediaAsset_storageKey_key" ON "MediaAsset"("storageKey");
CREATE UNIQUE INDEX "SiteSetting_key_key" ON "SiteSetting"("key");
CREATE INDEX "AuditEvent_createdAt_idx" ON "AuditEvent"("createdAt");
CREATE INDEX "AuditEvent_target_idx" ON "AuditEvent"("target");
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");
CREATE INDEX "PasswordResetToken_userId_expiresAt_idx" ON "PasswordResetToken"("userId", "expiresAt");

ALTER TABLE "BlogPostVersion" ADD CONSTRAINT "BlogPostVersion_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PageVersion" ADD CONSTRAINT "PageVersion_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PageVersion" ADD CONSTRAINT "PageVersion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
