import './globals.css'
import { AuthProvider } from '../contexts/AuthContext';

export const metadata = {
  title: 'Sistema de Homologaciones',
  description: 'Sistema de gestión de homologaciones',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}