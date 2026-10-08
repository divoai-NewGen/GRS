import QRCode from "qrcode";

export function getPublicCardUrl(publicToken: string, baseUrl?: string): string {
  const host = baseUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${host.replace(/\/$/, "")}/r/${publicToken}`;
}

export async function generateQrSvg(url: string, options?: { margin?: number; color?: { dark: string; light: string } }): Promise<string> {
  return QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: options?.margin ?? 2,
    color: options?.color ?? {
      dark: "#0f172a",
      light: "#ffffff",
    },
  });
}

export async function generateQrDataUrl(url: string, options?: { width?: number; margin?: number }): Promise<string> {
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: "H",
    width: options?.width ?? 600,
    margin: options?.margin ?? 2,
    color: {
      dark: "#0f172a",
      light: "#ffffff",
    },
  });
}
