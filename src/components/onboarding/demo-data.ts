// Demo content for the onboarding dashboard prototype. Everything here is fake
// customer data; in the pilot it would come from the Salesforce opportunity.

export const FAQ_BASE = "https://able-care.co/resources/training#";
export const SUPPORT_EMAIL = "support@able-care.co";
export const PORTAL_URL = "https://portal.able-care.io";
export const PORTAL_QUICK_START = "/downloads/Able-Portal-Quick-Start.pdf";
export const APP_STORE_URL = "https://apps.apple.com/us/app/able-assess/id6612033581";
export const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.gripable.ableassess";
export const TRAINING_VIDEO_ID = "4055O-JrnBU";

export const customer = {
  firstName: "Dana",
  fullName: "Dana Whitfield",
  email: "dana.whitfield@maplegrovehomecare.com",
  organization: "Maple Grove Home Care",
};

export const order = {
  reference: "ORD-10482",
  kits: 2,
  address: "1200 Oak Street, Columbus, OH 43215",
  carrier: "UPS",
  trackingNumber: "1Z999AA10123456784",
  timeline: [
    { key: "ordered", label: "Order confirmed", date: "Mon, Nov 2" },
    { key: "dispatched", label: "Dispatched", date: "Tue, Nov 3" },
    { key: "in_transit", label: "In transit", date: "Wed, Nov 4" },
    { key: "delivered", label: "Delivered", date: "Thu, Nov 5" },
  ],
  // Agreed in the sale and set up by us; shown to confirm, not to edit.
  settings: [
    { label: "Units", value: "lb and feet" },
    { label: "Tests", value: "Grip Strength, Chair Stand, Timed Up and Go, Gait Speed" },
    { label: "Able Score", value: "On" },
  ],
};

export type AccountTier = "standard" | "enterprise";

export interface Host {
  name: string;
  role: string;
  initials: string;
}

// Who runs the onboarding session. In the pilot this comes from an account
// tier field on the Salesforce opportunity, and each combination is its own
// Calendly event.
export const sessionHosts: Record<AccountTier, Host[]> = {
  standard: [{ name: "Garrett Baldry", role: "Your Sales Manager", initials: "GB" }],
  enterprise: [
    { name: "Pedro Douglass-Kirk", role: "Customer Success", initials: "PD" },
    { name: "Paul Rinne", role: "CEO, Able Care", initials: "PR" },
  ],
};

export const sessionSlots = [
  { day: "Mon, Nov 9", times: ["10:00 AM", "1:30 PM", "3:00 PM"] },
  { day: "Tue, Nov 10", times: ["9:30 AM", "11:00 AM", "2:00 PM"] },
  { day: "Wed, Nov 11", times: ["10:30 AM", "4:00 PM"] },
  { day: "Thu, Nov 12", times: ["9:00 AM", "1:00 PM", "3:30 PM"] },
];

export interface ChecklistItem {
  id: string;
  title: string;
  detail: string;
  link?: { label: string; href: string };
}

export const checklist: ChecklistItem[] = [
  {
    id: "charge",
    title: "Charge the GripAble",
    detail: "A full charge takes about 1.5 hours. The light turns solid green when it's full.",
    link: { label: "Battery FAQs", href: `${FAQ_BASE}charging-time` },
  },
  {
    id: "install",
    title: "Install Able Assess",
    detail: "On each phone or tablet your team will use, from the App Store or Google Play.",
    link: { label: "App Store", href: APP_STORE_URL },
  },
  {
    id: "security",
    title: "Turn on a PIN, fingerprint or face unlock",
    detail: "On each device, so staff don't need an email login code every time.",
    link: { label: "Why this matters", href: `${FAQ_BASE}mobile-security` },
  },
  {
    id: "whitelist",
    title: "Ask IT to allow our login emails",
    detail: "Whitelist the domain able-care.io and the sender noreply@able-care.io, so login codes arrive.",
    link: { label: "Text to send IT", href: `${FAQ_BASE}otp-not-received` },
  },
  {
    id: "space",
    title: "Find a chair and a walkway",
    detail: "A sturdy chair without arms, and a clear 20 ft (6 m) walkway if you have the space.",
  },
];

export interface TrainingModule {
  slug: string;
  title: string;
  summary: string;
  start: number;
  end: number;
  points: string[];
  faqs: { label: string; anchor: string }[];
  note?: string;
}

// Phase 1 plays one chapter of the existing 20-minute Able Assess Training
// Video per module (chapter times from the video's YouTube description).
export const trainingModules: TrainingModule[] = [
  {
    slug: "sign-in",
    title: "Install the app and sign in",
    summary: "Get Able Assess on your phone or tablet and sign in to your organization.",
    start: 24,
    end: 126,
    points: [
      "Install Able Assess from the App Store or Google Play.",
      'Tap Sign in with the email your admin added for you. Don\'t tap "Create new account".',
      "Enter the one-time passcode we email you from noreply@able-care.io.",
    ],
    faqs: [
      { label: "I did not receive my one-time passcode", anchor: "otp-not-received" },
      { label: "Do I need to enable mobile security?", anchor: "mobile-security" },
    ],
    note: 'This video still shows "Create a Provider Account". Use Sign in instead; a new recording is on the way.',
  },
  {
    slug: "connect-gripable",
    title: "Connect and calibrate your GripAble",
    summary: "Pair the GripAble with your device and calibrate it before your first test.",
    start: 126,
    end: 212,
    points: [
      "Squeeze the GripAble until the blue light pulses to wake it.",
      "Pair one GripAble at a time, and close the app on other nearby devices.",
      "Calibrate in unlocked mode, as shown in the video.",
    ],
    faqs: [
      { label: "My GripAble connected to the wrong phone or tablet", anchor: "wrong-device" },
      { label: "Is there an off button on the GripAble?", anchor: "turn-off-gripable" },
    ],
  },
  {
    slug: "add-a-client",
    title: "Add a client profile",
    summary: "Create a profile so results are saved and tracked over time.",
    start: 212,
    end: 278,
    points: [
      "You can add clients in the app, or in the Able Portal before a visit.",
      "Enter date of birth and sex carefully: results are compared with norms for age and sex.",
      "Clients added in the Able Portal appear in the app straight away.",
    ],
    faqs: [
      { label: "How do I add staff or participants?", anchor: "add-staff-participants" },
      { label: 'Why does the risk status say "Not applicable"?', anchor: "risk-not-applicable" },
    ],
  },
  {
    slug: "grip-strength",
    title: "Grip strength test",
    summary: "How to run the grip test and get a reliable result.",
    start: 278,
    end: 413,
    points: [
      "Ask the person to squeeze steadily up to their maximum effort, not in a sudden spike.",
      "Hold the GripAble in the same position for each trial.",
      "In a screening, grip is one trial on the dominant hand.",
    ],
    faqs: [
      { label: "How should the participant squeeze the GripAble?", anchor: "how-to-squeeze" },
      { label: 'Why do healthy people sometimes score "below average"?', anchor: "below-average-grip" },
    ],
  },
  {
    slug: "chair-stand",
    title: "Chair Stand test",
    summary: "Set up and run the 30-Second Chair Stand.",
    start: 413,
    end: 597,
    points: [
      "Use a sturdy chair without arms.",
      "The GripAble sits in the waist bag on the lower back for this test.",
      "Follow the on-screen instructions, and skip the test if it isn't safe for the person.",
    ],
    faqs: [{ label: "Can I skip a test?", anchor: "skip-a-test" }],
  },
  {
    slug: "gait-and-tug",
    title: "Gait Speed and Timed Up and Go",
    summary: "The two walking tests, and how to finish the TUG correctly.",
    start: 597,
    end: 795,
    points: [
      "Clear a straight walkway before you start.",
      "For the TUG, the person must sit fully back in the chair at the end.",
      "Only press Test complete once they're fully at rest: the app times the movement, not your tap.",
    ],
    faqs: [{ label: "Why has my TUG test not completed?", anchor: "tug-not-completed" }],
  },
  {
    slug: "falls-screening",
    title: "Run a Falls Screening",
    summary: "Put the four tests together and share the PDF report.",
    start: 795,
    end: 993,
    points: [
      "Start from Users, not Quick Test: Quick Test is for demos and doesn't save.",
      "Skip any test the person can't do safely, and record deviations such as a walking aid.",
      "The PDF report is emailed to the staff member who is signed in.",
    ],
    faqs: [
      { label: "Why didn't my results save?", anchor: "results-not-saved" },
      { label: "What is the Able Score?", anchor: "able-score" },
    ],
  },
  {
    slug: "battery-and-settings",
    title: "Battery, turning off and settings",
    summary: "Keep the GripAble charged and switch it off between sessions.",
    start: 993,
    end: 1137,
    points: [
      "Turn the GripAble off in the app, or close the app fully. It switches itself off within a minute.",
      "Don't leave the app open between sessions, or the GripAble keeps trying to connect.",
      "Charge it the day before a busy screening session.",
    ],
    faqs: [
      { label: "How long does my GripAble battery last?", anchor: "battery-life" },
      { label: "How do I check the battery level?", anchor: "check-battery-level" },
    ],
  },
];

export function formatLength(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export const afterSessionResources = [
  { title: "Intro for Seniors", description: "Explains the screening to your clients." },
  { title: "Next Steps", description: "What to do after a screening." },
  { title: "Example Falls Risk Report", description: "A sample report to share with families." },
  { title: "Evidence Base", description: "The research behind the assessments." },
];

// Scripted answers for the demo help assistant. Each one points to its
// permanent FAQ link on the Training & FAQs page.
export const helpAnswers = [
  {
    question: "My login code hasn't arrived",
    keywords: ["code", "otp", "passcode", "login", "email"],
    answer:
      "Check your Junk or Spam folder for an email from noreply@able-care.io, and wait the full 5 minutes before asking for a new code (a new request cancels the old one). If codes still don't arrive, ask IT to whitelist able-care.io.",
    anchor: "otp-not-received",
  },
  {
    question: "How do I turn the GripAble off?",
    keywords: ["off", "turn", "power", "switch"],
    answer:
      "There's no power button. Tap the GripAble symbol on the app's home screen and use the Turn GripAble off toggle, or close the app fully. It switches itself off within about a minute.",
    anchor: "turn-off-gripable",
  },
  {
    question: "Why didn't my results save?",
    keywords: ["save", "saved", "results", "quick test"],
    answer:
      "Quick Test is for demos and doesn't save. Go to Users, choose or create the client first, then run a screening.",
    anchor: "results-not-saved",
  },
  {
    question: 'A staff member tapped "Create new account"',
    keywords: ["create", "account", "new user", "individual"],
    answer:
      "That makes a separate account that can't see your clients. Email us and we'll move it, with its data, into your organization.",
    anchor: "cannot-create-user",
  },
  {
    question: "How do I add my staff?",
    keywords: ["staff", "team", "add", "provider", "portal"],
    answer:
      "Your admin adds staff as Providers in the Able Portal, using their work email. They then sign in to the app with that email.",
    anchor: "add-staff-participants",
  },
];

export type StageKey = "ordered" | "delivered" | "booked" | "after" | "done";

export const stages: { key: StageKey; label: string }[] = [
  { key: "ordered", label: "Just ordered" },
  { key: "delivered", label: "Kit delivered" },
  { key: "booked", label: "Session booked" },
  { key: "after", label: "After the session" },
  { key: "done", label: "All done" },
];
