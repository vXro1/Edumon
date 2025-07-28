import './globals.css'

export const metadata = {
  title: 'Sistema de Homologaciones Universitarias',
  description: 'Plataforma moderna para gestión de homologaciones académicas',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}