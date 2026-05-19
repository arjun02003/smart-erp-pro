import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "SmartERP Pro Cloud – Premium GST Billing & Inventory ERP for India",
  description:
    "India's most powerful cloud ERP for Medical Stores, Kirana Shops, Wholesale & Retail. GST Billing, Inventory, Accounting, AI Reports & more. Start free trial today.",
  keywords:
    "ERP software India, GST billing software, inventory management, accounting software, medical store software, kirana shop ERP",
  openGraph: {
    title: "SmartERP Pro Cloud",
    description: "Premium SaaS ERP for Indian Businesses",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#111118",
              color: "#f1f5f9",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
