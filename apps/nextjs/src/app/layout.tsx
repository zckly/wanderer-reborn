import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { cn } from "@acme/ui";
import { ThemeProvider } from "@acme/ui/theme";
import { Toaster } from "@acme/ui/toast";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { ClerkProvider } from "@clerk/nextjs";

import { env } from "~/env";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://life.wanderer.space"
      : "http://localhost:3000",
  ),
  title: "future life simulator",
  description: "explore future possibilities",
  openGraph: {
    title: "future life simulator",
    description: "explore future possibilities",
    url: "https://life.wanderer.space",
    siteName: "future life simulator",
  },
  twitter: {
    card: "summary_large_image",
    site: "@wenquai",
    creator: "@wenquai",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans text-foreground antialiased",
            GeistSans.variable,
            GeistMono.variable,
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="light">
            <TRPCReactProvider>{props.children}</TRPCReactProvider>
            <Toaster />
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
