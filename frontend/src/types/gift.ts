export type UserRole = "grandparent" | "grandchild" | "trustee";

export type GiftStatus =
  | "Draft"
  | "Active"
  | "Under Review"
  | "Approved"
  | "Rejected"
  | "Redirected"
  | "Completed";

export type RiskProfile = "Conservative" | "Balanced" | "Growth";

export type Currency = "USD" | "INR";

export type RuleType = "Time" | "Milestone" | "Behavior";

export interface GiftRule {
  type: RuleType;
  atAge?: number;
  milestone?: string;
  condition?: string;
  gpaThreshold?: number;
  fallback?: "push_next" | "redirect_ngo";
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Grandchild {
  id: string;
  name: string;
  linkedGrandparentId: string;
  age: number;
  dateOfBirth: string;
}

export interface Milestone {
  id: string;
  gift_id: string;
  type: string;
  percentage: number;
  status: "Pending" | "Submitted" | "Approved" | "Rejected";
}

export interface MediaMessage {
  id: string;
  gift_id: string;
  uploader_id: string;
  type: "text" | "photo" | "audio" | "video";
  file_path: string;
  created_at: string;
}

export interface Gift {
  id: string;
  grandparent_id: string;
  grandchild_id: string;
  grandchild_name?: string;
  corpus: number;
  currency: Currency;
  message?: string;
  status: GiftStatus;
  risk_profile: RiskProfile;
  rule_type: RuleType;
  fallback_ngo_id?: string;
  milestones: Milestone[];
  media_messages?: MediaMessage[];
}

export interface Notification {
  id: string;
  recipient_id: string;
  role: UserRole;
  event_type: string;
  message: string;
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export interface VoiceParseDetails {
  grandchild_name?: string;
  corpus?: number;
  currency?: Currency;
  risk_profile?: RiskProfile;
  release_condition?: string;
  confidence: number;
}
