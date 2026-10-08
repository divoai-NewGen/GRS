import React from "react";
import { InquiriesClient } from "./InquiriesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inquiries & Leads | Admin Portal",
};

export default function InquiriesPage() {
  return <InquiriesClient />;
}
