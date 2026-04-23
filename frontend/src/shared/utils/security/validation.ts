export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateSubject(subject: string): boolean {
  return subject.trim().length > 0 && subject.trim().length <= 200;
}
