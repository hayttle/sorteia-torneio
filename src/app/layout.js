import "./globals.css"
import {Inter} from "next/font/google"

const inter = Inter({subsets: ["latin"]})

export const metadata = {
  title: "Sorteia Atletas",
  description: "App para fazer o sorteio das duplas de atletas"
}

export default function RootLayout({children}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
