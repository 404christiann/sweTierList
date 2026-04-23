import './globals.css'

export const metadata = {
  title: 'SWE Interview Difficulty Tier List',
  description: 'Filterable tier list of SWE interview difficulty by company — Bay Area & SoCal 2026',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
