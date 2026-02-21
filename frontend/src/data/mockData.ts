import type { User, Gift, Notification, Currency, Grandchild } from "@/types/gift";

export const DEMO_USERS: User[] = [
  { id: "11111111-1111-1111-1111-111111111111", name: "Grandma Shanti", role: "grandparent", avatar: "👵" },
  { id: "22222222-2222-2222-2222-222222222222", name: "Arjun", role: "grandchild", avatar: "👧" },
  { id: "33333333-3333-3333-3333-333333333333", name: "Trustee Sahil", role: "trustee", avatar: "👨" },
];

export const DEMO_GRANDCHILDREN: Grandchild[] = [
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Arjun",
    linkedGrandparentId: "11111111-1111-1111-1111-111111111111",
    age: 16,
    dateOfBirth: "2010-03-15"
  },
];

export const DEMO_GIFTS: Gift[] = [
  {
    id: "gift-1-uuid",
    grandparent_id: "11111111-1111-1111-1111-111111111111",
    grandchild_id: "22222222-2222-2222-2222-222222222222",
    grandchild_name: "Arjun",
    corpus: 25000,
    currency: "USD",
    status: "Active",
    risk_profile: "Balanced",
    rule_type: "Time",
    milestones: [],
  }
];

export const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    recipient_id: "11111111-1111-1111-1111-111111111111",
    role: "grandparent",
    event_type: "proof_submitted",
    message: "Arjun submitted proof for Graduation milestone",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    action_url: "/grandparent",
  }
];

export interface PortfolioSummary {
  totalCorpus: number;
  allocatedToGifts: number;
  availableBalance: number;
  riskBreakdown: {
    Conservative: number;
    Balanced: number;
    Growth: number;
  };
  currency: Currency;
}

export const DEMO_PORTFOLIO: PortfolioSummary = {
  totalCorpus: 58000,
  allocatedToGifts: 40000,
  availableBalance: 18000,
  riskBreakdown: {
    Conservative: 0,
    Balanced: 25000,
    Growth: 0,
  },
  currency: "USD",
};

export const MOCK_GROWTH_DATA = [
  { month: "Jan", value: 40000 },
  { month: "Feb", value: 41200 },
  { month: "Mar", value: 42100 },
  { month: "Apr", value: 41800 },
  { month: "May", value: 43500 },
  { month: "Jun", value: 44200 },
  { month: "Jul", value: 45800 },
  { month: "Aug", value: 46100 },
  { month: "Sep", value: 47500 },
  { month: "Oct", value: 48200 },
  { month: "Nov", value: 49800 },
  { month: "Dec", value: 51500 },
];
