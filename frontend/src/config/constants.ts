// GiftForge Configuration Constants
// These mirror the backend config.py values

export const FX_RATE_USD_TO_INR = 83.5;

export const CAGR_RATES = {
  Conservative: 0.06,
  Balanced: 0.10,
  Growth: 0.14,
} as const;

export const OVERRIDE_WINDOW_DAYS = 7;

export const TRUSTEE_AUTO_APPROVAL = true;

export const MILESTONES = [
  "Graduation",
  "First Job",
  "Marriage",
  "Home Purchase",
  "College Admission Fee",
] as const;

export const BEHAVIOR_CONDITIONS = [
  "Maintain GPA above threshold",
  "Complete Financial Literacy Course",
  "Monthly Savings Contribution",
] as const;

export const RISK_PROFILES = ["Conservative", "Balanced", "Growth"] as const;

export const GIFT_STATES = [
  "Draft",
  "Active",
  "Under Review",
  "Approved",
  "Rejected",
  "Redirected to NGO",
  "Completed",
] as const;

export const VALID_TRANSITIONS: Record<string, string[]> = {
  Draft: ["Active"],
  Active: ["Under Review", "Completed"],
  "Under Review": ["Approved", "Rejected"],
  Approved: ["Completed"],
  Rejected: ["Redirected to NGO"],
  "Redirected to NGO": [],
  Completed: [],
};

export const DEMO_NGOS = [
  { id: "ngo-1", name: "Children's Education Fund" },
  { id: "ngo-2", name: "Youth Empowerment Trust" },
  { id: "ngo-3", name: "Future Scholars Foundation" },
];

export const EDUCATIONAL_CONTENT = [
  {
    id: "edu-1",
    title: "What is a Mutual Fund?",
    summary: "A mutual fund pools money from many people to invest in stocks, bonds, or other assets. It's managed by professionals so you don't have to worry about picking individual investments.",
    icon: "📊",
  },
  {
    id: "edu-2",
    title: "Risk vs Return",
    summary: "Higher potential returns usually come with higher risk. Conservative investments are safer but grow slower, while growth investments can grow faster but may fluctuate more.",
    icon: "⚖️",
  },
  {
    id: "edu-3",
    title: "Scam Awareness",
    summary: "Never share your account details with anyone. Legitimate institutions will never ask for your password. If an offer sounds too good to be true, it probably is.",
    icon: "🛡️",
  },
  {
    id: "edu-4",
    title: "Tax Basics",
    summary: "Gifts may have tax implications depending on your country's laws. It's good to consult a tax advisor for large gifts. Most small gifts are tax-free.",
    icon: "📋",
  },
  {
    id: "edu-5",
    title: "Goal Planning",
    summary: "Setting clear financial goals helps you save effectively. Think about what you want to achieve and by when, then work backwards to figure out how much to save.",
    icon: "🎯",
  },
];
