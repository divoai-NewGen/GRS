import Link from "next/link";
import { AlertCircle, HelpCircle, ShieldAlert, Clock, Home } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Card Status | GrowBroo",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function StatusPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;

  let title = "Notice";
  let description = "There was an issue processing your review request.";
  let Icon = HelpCircle;
  let badgeColor = "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";

  switch (reason) {
    case "not_found":
      title = "Card Not Found";
      description = "Sorry, this review card could not be found. Please check that you scanned the official card provided.";
      Icon = HelpCircle;
      badgeColor = "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
      break;

    case "disabled":
      title = "Card Inactive";
      description = "This review card is currently inactive. Please check with the staff or front desk for assistance.";
      Icon = ShieldAlert;
      badgeColor = "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400";
      break;

    case "unassigned":
      title = "Card Not Activated";
      description = "This review card hasn't been activated yet. If you are the business manager, please assign this card in your dashboard.";
      Icon = Clock;
      badgeColor = "bg-[#006B21]/20 text-[#006B21] dark:bg-[#006B21]/40 dark:text-[#39E900]";
      break;

    case "business_inactive":
      title = "Destination Unavailable";
      description = "This review destination is temporarily unavailable. Please try again later.";
      Icon = AlertCircle;
      badgeColor = "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      break;

    case "rate_limited":
      title = "Too Many Scans";
      description = "Please wait a moment before scanning this card again.";
      Icon = ShieldAlert;
      badgeColor = "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      break;

    default:
      title = "Unable to Redirect";
      description = "An unexpected error occurred while reaching the review page.";
      Icon = AlertCircle;
      badgeColor = "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
      break;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-slate-100 dark:bg-slate-800">
          <Icon className="w-8 h-8 text-slate-700 dark:text-slate-300" />
        </div>

        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 ${badgeColor}`}>
          Status Notification
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          {title}
        </h1>

        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8">
          {description}
        </p>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <Home className="w-4 h-4" />
            Return to Homepage
          </Link>
        </div>
      </div>

      <p className="mt-8 text-xs text-slate-600 dark:text-slate-400">
        Powered by GrowBroo Review Network
      </p>
    </div>
  );
}
