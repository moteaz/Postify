-- Add missing indexes for performance optimization

-- UserCV indexes
CREATE INDEX IF NOT EXISTS "user_cvs_userId_isActive_idx" ON "user_cvs"("userId", "isActive");
CREATE INDEX IF NOT EXISTS "user_cvs_isActive_idx" ON "user_cvs"("isActive");

-- Application indexes
CREATE INDEX IF NOT EXISTS "applications_status_idx" ON "applications"("status");
CREATE INDEX IF NOT EXISTS "applications_userId_status_generatedAt_idx" ON "applications"("userId", "status", "generatedAt");
