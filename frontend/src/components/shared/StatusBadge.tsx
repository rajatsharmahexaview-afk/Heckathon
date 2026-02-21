import React from "react";
import type { GiftStatus } from "@/types/gift";

const statusStyles: Record<GiftStatus, string> = {
  Draft: "bg-muted text-muted-foreground",
  Active: "bg-success/15 text-success",
  "Under Review": "bg-warning/15 text-warning-foreground",
  Approved: "bg-success/15 text-success",
  Rejected: "bg-destructive/15 text-destructive",
  "Redirected to NGO": "bg-info/15 text-info",
  Completed: "bg-primary/15 text-primary",
};

const StatusBadge: React.FC<{ status: GiftStatus }> = ({ status }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusStyles[status]}`}>
    {status}
  </span>
);

export default StatusBadge;
