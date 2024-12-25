import '@mantine/core/styles.css'
import { ColorSchemeScript } from '@mantine/core'
import { Providers } from './providers'

export const metadata = {
  title: 'Spanish Verb Conjugator',
  description: 'Practice Spanish verb conjugations with interactive quizzes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
