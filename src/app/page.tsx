import Link from "next/link";

// Sprint 1.1 placeholder. The real homepage (hero, search, trust row, how-it-works)
// ships in Sprint 1.2 — see PHASE_1_PLAN.md.
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-start justify-center gap-6 px-6 py-24">
      <span className="inline-flex items-center gap-2 rounded-pill bg-green-100 px-3 py-1 text-small font-medium text-green-800">
        Sprint 1.1
      </span>
      <h1 className="font-display text-display">Safe Ticket</h1>
      <p className="max-w-prose text-body-lg text-navy-600">
        פלטפורמת מכירה חוזרת של כרטיסים מאומתים — מחיר נקוב בלבד, העברה רשמית, נאמנות.
      </p>
      <Link
        href="/style-guide"
        className="inline-flex items-center rounded-md bg-navy-900 px-5 py-3 text-body font-medium text-white shadow-sm transition-colors hover:bg-navy-800"
      >
        Design System →
      </Link>
    </main>
  );
}
