import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ContactClient } from "./ContactClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & Request QR Cards | GrowBroo",
  description: "Request physical dynamic QR review cards for your business. Select Basic or Premium plan with Google review automation.",
};

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#10251A] flex items-center justify-center text-white">
          <Loader2 className="w-8 h-8 animate-spin text-[#39E900]" />
        </div>
      }
    >
      <ContactClient />
    </Suspense>
  );
}
