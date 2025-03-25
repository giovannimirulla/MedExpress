import type { Metadata } from "next";
import Footer from "@/components/Footer";


export const metadata: Metadata = {
  title: "Welcome to MedExpress",
  description: "Login or sign up to access the platform",
  keywords: "MedExpress, login, sign up",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div>
        {children}
        <Footer />
        </div>
  );
}
