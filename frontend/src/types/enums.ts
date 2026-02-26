export enum ApplicationStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  FAILED = "FAILED"
}

export const DashboardTab = {
  NEW: "new",
  HISTORY: "history",
  CVS: "cvs"
} as const;

export type DashboardTabType = typeof DashboardTab[keyof typeof DashboardTab];
