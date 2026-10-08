import { SettingsClient } from "./SettingsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform Settings",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
