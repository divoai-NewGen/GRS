import { AnalyticsClient } from "./AnalyticsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics & Telemetry",
};

export default function AnalyticsPage() {
  return <AnalyticsClient />;
}
