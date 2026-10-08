import { BusinessesClient } from "./BusinessesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Businesses",
};

export default function BusinessesPage() {
  return <BusinessesClient />;
}
