import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Lights Out",
  description:
    "A challenging logic puzzle game where players must turn off all the lights on a grid to win. Each tap toggles not only the selected light but also its adjacent neighbors.",
  keywords: [
    "Lights Out",
    "Logic Puzzle",
    "Brain Teaser",
    "Strategy Game",
    "Grid-based",
    "React Game",
    "Web Game",
    "Casual Game",
    "Single Player",
    "Mind Game",
  ],
  authors: [{ name: "Mahmoud Mahmoud" }],
  creator: "Mahmoud Mahmoud",
  publisher: "Self-published",
  category: "Puzzle",
  applicationName: "Lights Out",
  generator: "Next.js",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://mahmoud-lightsout.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Lights Out",
    description: "A challenging logic puzzle game where players must turn off all the lights on a grid to win.",
    url: "https://mahmoud-lightsout.vercel.app",
    siteName: "Lights Out",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lights Out Game - A puzzle game where you toggle lights to turn them all off",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lights Out",
    description: "A challenging logic puzzle game where players must turn off all the lights on a grid to win.",
    images: ["/og-image.png"],
    creator: "@mahmoudmahmoud",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020817" },
  ],
  appleWebApp: {
    title: "Lights Out",
    statusBarStyle: "black-translucent",
    capable: true,
  },
  other: {
    "game:developer": "Mahmoud Mahmoud",
    "game:release_date": "2024",
    "game:platforms": "Web Browser (PC, Mac, Mobile)",
    "game:genre": "Puzzle, Logic, Strategy",
    "game:features": "Multiple board sizes (3×3, 4×4, 5×5, and 6×6), Guaranteed solvable puzzles, Move counter",
    "game:age_rating": "ESRB: E (Everyone), PEGI: 3+",
    "game:languages": "English",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

