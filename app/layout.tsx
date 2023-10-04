import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import './globals.css'
import AuthContext from '@/app/context/AuthContext'

const inter = Noto_Sans({ subsets: ['latin'], weight: "400" })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext>
          {children}
        </AuthContext>
      </body>
    </html>
  )
}
