export const VALIDATION = {
  EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  MAX_EMAIL_LENGTH: 254,
  MAX_SUBJECT_LENGTH: 998,
  MAX_COVER_LETTER_LENGTH: 10000,
  MAX_JOB_DESCRIPTION_LENGTH: 50000,
  MAX_CV_SIZE_MB: 5,
  ALLOWED_CV_TYPES: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

export const validateEmail = (email: string): boolean => {
  if (!email || email.length > VALIDATION.MAX_EMAIL_LENGTH) return false;
  return VALIDATION.EMAIL_REGEX.test(email);
};

export const validateSubject = (subject: string): boolean => {
  return subject.trim().length > 0 && subject.length <= VALIDATION.MAX_SUBJECT_LENGTH;
};

export const validateCoverLetter = (text: string): boolean => {
  return text.trim().length > 0 && text.length <= VALIDATION.MAX_COVER_LETTER_LENGTH;
};

export const validateFileSize = (size: number): boolean => {
  return size > 0 && size <= VALIDATION.MAX_CV_SIZE_MB * 1024 * 1024;
};

export const validateFileType = (type: string): boolean => {
  return VALIDATION.ALLOWED_CV_TYPES.includes(type);
};
