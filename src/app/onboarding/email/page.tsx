import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { customer } from "@/components/onboarding/demo-data";

const emails = [
  {
    label: "Sent once, when the order is dispatched",
    subject: "Your Able Care onboarding dashboard is ready",
    heading: `Welcome to Able Care, ${customer.firstName}`,
    body: [
      "Thank you for your order. Everything you need to get your team started with Able Assess is in one place: your onboarding dashboard.",
      "You can track your delivery, book your onboarding session and start training there. You won't need to keep this email.",
    ],
    button: "Open your dashboard",
  },
  {
    label: "Sent whenever something changes, with no details in it",
    subject: "You have a new step on your Able Care dashboard",
    heading: "There's something new on your dashboard",
    body: ["Open your dashboard to see what's next."],
    button: "Open dashboard",
  },
];

export default function EmailPreviewPage() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] py-10">
      <div className="container mx-auto max-w-3xl px-4">
        <Link
          href="/onboarding"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ac-black/60 hover:text-ac-blue"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to the dashboard
        </Link>
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-ac-blue">Demo · Notification emails</div>
        <h1 className="mb-3 text-3xl font-bold">What lands in the customer&apos;s inbox</h1>
        <p className="mb-10 text-lg font-light text-ac-black/70">
          Only two kinds of email. Neither carries any onboarding detail: they point back to the dashboard, so a missed
          email never breaks the process.
        </p>

        <div className="space-y-10">
          {emails.map((e) => (
            <section key={e.subject}>
              <div className="mb-3 text-sm font-semibold text-ac-black/60">{e.label}</div>
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                <dl className="space-y-1 border-b border-black/5 px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <dt className="w-16 text-ac-black/50">From</dt>
                    <dd>Able Care &lt;support@able-care.co&gt;</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-16 text-ac-black/50">To</dt>
                    <dd>{customer.email}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-16 text-ac-black/50">Subject</dt>
                    <dd className="font-semibold">{e.subject}</dd>
                  </div>
                </dl>
                <div className="px-6 py-10 text-center md:px-16">
                  <Image
                    src="/images/able-care-logo-horizontal.svg"
                    alt="Able Care"
                    width={140}
                    height={30}
                    className="mx-auto mb-8"
                  />
                  <h2 className="mb-4 text-2xl font-bold">{e.heading}</h2>
                  {e.body.map((p) => (
                    <p key={p} className="mb-3 font-light text-ac-black/70">
                      {p}
                    </p>
                  ))}
                  <Link
                    href="/onboarding"
                    className="mt-6 inline-flex rounded-full bg-ac-blue px-8 py-3.5 text-sm font-bold text-white hover:bg-ac-blue/90"
                  >
                    {e.button}
                  </Link>
                  <p className="mt-10 text-xs text-ac-black/40">Able Care by GripAble Inc · support@able-care.co</p>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
