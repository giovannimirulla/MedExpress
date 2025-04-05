import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "MedExpress",
  description:  "MedExpress is a platform that allows you to book appointments with doctors and get prescriptions online.",
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
