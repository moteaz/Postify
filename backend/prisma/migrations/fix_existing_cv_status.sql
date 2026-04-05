-- Update existing CVs that have parsedText to DONE status
UPDATE "user_cvs" 
SET "status" = 'DONE' 
WHERE "parsedText" IS NOT NULL;

-- Update existing CVs without parsedText to FAILED status
UPDATE "user_cvs" 
SET "status" = 'FAILED' 
WHERE "parsedText" IS NULL;
