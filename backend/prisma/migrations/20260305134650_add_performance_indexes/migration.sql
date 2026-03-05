-- CreateIndex
CREATE INDEX "applications_status_idx" ON "applications"("status");

-- CreateIndex
CREATE INDEX "applications_userId_status_generatedAt_idx" ON "applications"("userId", "status", "generatedAt");

-- CreateIndex
CREATE INDEX "user_cvs_userId_isActive_idx" ON "user_cvs"("userId", "isActive");

-- CreateIndex
CREATE INDEX "user_cvs_isActive_idx" ON "user_cvs"("isActive");
