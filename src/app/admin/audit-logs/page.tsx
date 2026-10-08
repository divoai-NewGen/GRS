import { AuditLogsClient } from "./AuditLogsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audit Logs",
};

export default function AuditLogsPage() {
  return <AuditLogsClient />;
}
