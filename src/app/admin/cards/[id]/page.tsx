import { CardDetailClient } from "./CardDetailClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Card Details",
};

export default function CardDetailPage() {
  return <CardDetailClient />;
}
