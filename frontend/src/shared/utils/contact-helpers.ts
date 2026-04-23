import { Mail, Phone, Linkedin, Globe, Github, Link2 } from "lucide-react";

export const getContactIcon = (type: string) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes("email")) return Mail;
  if (lowerType.includes("phone")) return Phone;
  if (lowerType.includes("linkedin")) return Linkedin;
  if (lowerType.includes("github")) return Github;
  if (lowerType.includes("website") || lowerType.includes("portfolio")) return Globe;
  return Link2;
};

export const getContactColor = (type: string) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes("email")) return { bg: "bg-green-50", text: "text-green-600", badge: "bg-green-100 text-green-700" };
  if (lowerType.includes("phone")) return { bg: "bg-purple-50", text: "text-purple-600", badge: "bg-purple-100 text-purple-700" };
  if (lowerType.includes("linkedin")) return { bg: "bg-blue-50", text: "text-blue-600", badge: "bg-blue-100 text-blue-700" };
  if (lowerType.includes("github")) return { bg: "bg-gray-50", text: "text-gray-700", badge: "bg-gray-100 text-gray-700" };
  if (lowerType.includes("website") || lowerType.includes("portfolio")) return { bg: "bg-indigo-50", text: "text-indigo-600", badge: "bg-indigo-100 text-indigo-700" };
  return { bg: "bg-orange-50", text: "text-orange-600", badge: "bg-orange-100 text-orange-700" };
};

export const getContactBadge = (type: string) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes("email")) return "Email";
  if (lowerType.includes("phone")) return "Phone";
  if (lowerType.includes("linkedin") || lowerType.includes("github") || lowerType.includes("website") || lowerType.includes("portfolio")) return "URL";
  return "Custom";
};
