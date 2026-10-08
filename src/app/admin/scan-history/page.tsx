import { ScanHistoryClient } from "./ScanHistoryClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scan History",
};

export default function ScanHistoryPage() {
  return <ScanHistoryClient />;
}
