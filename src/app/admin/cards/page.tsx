import { CardsClient } from "./CardsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cards Inventory",
};

export default function CardsPage() {
  return <CardsClient />;
}
