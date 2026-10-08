import React, { Suspense } from "react";
import { PrintableClient } from "./PrintableClient";
import { Loader2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Printable Card Template",
};

export default function PrintablePage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex justify-center text-white/50">
          <Loader2 className="w-8 h-8 animate-spin text-[#39E900]" />
        </div>
      }
    >
      <PrintableClient />
    </Suspense>
  );
}
