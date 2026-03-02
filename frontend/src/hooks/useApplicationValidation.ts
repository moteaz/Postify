import { useMemo } from "react";
import { VALIDATION } from "@/config/messages";
import type { GeneratedContent } from "@/types";

export const useApplicationValidation = (content: GeneratedContent | null) => {
  return useMemo(() => {
    const isEmailValid = content?.recruiterEmail 
      ? VALIDATION.EMAIL_REGEX.test(content.recruiterEmail) 
      : false;
    
    const isSubjectValid = content?.subject 
      ? content.subject.trim().length > 0 
      : false;
    
    const canSend = isEmailValid && isSubjectValid;

    return { isEmailValid, isSubjectValid, canSend };
  }, [content]);
};
