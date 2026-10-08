import { BusinessDetailClient } from "./BusinessDetailClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Details",
};

export default function BusinessDetailPage() {
  return <BusinessDetailClient />;
}
