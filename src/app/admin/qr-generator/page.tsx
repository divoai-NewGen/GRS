import { QrGeneratorClient } from "./QrGeneratorClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Generator",
};

export default function QrGeneratorPage() {
  return <QrGeneratorClient />;
}
