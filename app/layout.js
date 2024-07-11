import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark, neobrutalism } from '@clerk/themes';
import { Toaster } from '../components/ui/sonner';
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Interview Mocker",
  description: "AI Interview Platform for Preparing for interviews",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{
      baseTheme: [dark, neobrutalism]
    }}
>
    <html lang="en">
      <body className={inter.className}>
        <Toaster />
        {children}
        </body>
    </html>
    </ClerkProvider>
  );
}
