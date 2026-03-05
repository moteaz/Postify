import { useMemo } from "react";
import { validateEmail, validateSubject } from "@/utils/security/validation";
import type { GeneratedContent } from "@/types";

export const useApplicationValidation = (content: GeneratedContent | null) => {
  return useMemo(() => {
    const isEmailValid = content?.recruiterEmail 
      ? validateEmail(content.recruiterEmail) 
      : false;
    
    const isSubjectValid = content?.subject 
      ? validateSubject(content.subject) 
      : false;
    
    const canSend = isEmailValid && isSubjectValid;

    return { isEmailValid, isSubjectValid, canSend };
  }, [content]);
};
