export enum ApplicationStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  FAILED = "FAILED"
}

export const DashboardTab = {
  NEW: "new",
  HISTORY: "history",
  CVS: "cvs",
  CONTACTS: "contacts",
  ADMIN: "admin"
} as const;

export type DashboardTabType = typeof DashboardTab[keyof typeof DashboardTab];
