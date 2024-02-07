import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providersUI/theme-provider";
import { cn } from "@/lib/utils";
import { ModalProvider } from "@/components/providersUI/modal-provider";
import { SocketProvider } from "@/components/providersUI/socket-provider";
import { QueryProvider } from "@/components/providersUI/query-provider";

const font = Noto_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChimeQuest",
  description: "Chat Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, "bg-white dark:bg-[#334155]")}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={true}
            storageKey="app-theme"
          >
            <SocketProvider>
              <ModalProvider />
              <QueryProvider>{children}</QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
