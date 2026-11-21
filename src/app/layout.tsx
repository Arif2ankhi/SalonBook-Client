import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

import "./globals.css";
import { ThemeProvider } from "./components/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "SalonBook | Book Salon Appointments Online",
  description:
    "Discover salon services and book appointments online — pick a service, choose a time slot, and let our stylists take care of the rest."
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
          <Toaster
            richColors
            position="top-right"
            duration={5000}
            closeButton
            toastOptions={{ style: { fontSize: "15px" } }}
          />
        </ThemeProvider>
      </body>
    </html>
    // <html
    //   lang="en" suppressHydrationWarning
    //   className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    // >
    //   <body  className="flex min-h-full flex-col">
    //     <Navbar />
    //     <main className="flex flex-1 flex-col">{children}</main>
    //     <Footer />
    //     <Toaster
    //       richColors
    //       position="top-right"
    //       duration={5000}
    //       closeButton
    //       toastOptions={{ style: { fontSize: "15px" } }}
    //     />
    //   </body>
    // </html>
  );
}
