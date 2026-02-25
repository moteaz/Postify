export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
} as const;

if (!process.env.NEXT_PUBLIC_API_URL && process.env.NODE_ENV === "production") {
  console.warn("⚠️ NEXT_PUBLIC_API_URL is not set. Using default localhost.");
}
