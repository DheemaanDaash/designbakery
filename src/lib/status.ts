import type { Database } from "@/integrations/supabase/types";

export type RequestStatus = Database["public"]["Enums"]["request_status"];
export type ContactStatus = Database["public"]["Enums"]["contact_status"];

export const REQUEST_STATUSES: { value: RequestStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "under_review", label: "Under Review" },
  { value: "in_progress", label: "In Progress" },
  { value: "awaiting_client", label: "Awaiting Client" },
  { value: "revision", label: "Revision" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export const ACTIVE_STATUSES: RequestStatus[] = ["under_review", "in_progress", "awaiting_client", "revision"];

export const CONTACT_STATUSES: { value: ContactStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "replied", label: "Replied" },
  { value: "archived", label: "Archived" },
];

export const requestStatusLabel = (s: RequestStatus) =>
  REQUEST_STATUSES.find((x) => x.value === s)?.label ?? s;
export const contactStatusLabel = (s: ContactStatus) =>
  CONTACT_STATUSES.find((x) => x.value === s)?.label ?? s;

export const statusVariant = (s: string): "default" | "secondary" | "outline" | "destructive" =>
  s === "completed" || s === "replied"
    ? "default"
    : s === "cancelled"
      ? "destructive"
      : s === "new"
        ? "outline"
        : "secondary";
