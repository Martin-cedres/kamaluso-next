"use client";

import '../styles/globals.css';
import Link from 'next/link';
import { SessionProvider, useSession, signOut } from "next-auth/react";

function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="p-4 flex justify-between items-center shadow">
      <h1 className="text-2xl font-bold text-black">Kamaluso</h1>
      <nav className="space-x-4 flex items-center">
        <Link href="/" className="hover:text-pink-600">Inicio</Link>
        <Link href="/productos" className="hover:text-pink-600">Productos</Link>
        <Link href="/imprimeya" className="hover:text-pink-600">ImprimeYa</Link>

        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="ml-4 bg-pink-600 text-white px-3 py-1 rounded hover:bg-pink-700"
          >
            Cerrar sesión
          </button>
        ) : (
          <Link href="/login" className="ml-4 hover:text-pink-600">Iniciar sesión</Link>
        )}
      </nav>
    </header>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white">
        <SessionProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="text-center p-4 bg-gray-100 text-sm mt-12 text-gray-600">
            © {new Date().getFullYear()} Kamaluso · San José, Uruguay · Todos los derechos reservados
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}