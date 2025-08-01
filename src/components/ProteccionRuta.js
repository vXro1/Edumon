'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

const ProteccionRuta = ({ children, rolesPermitidos = [] }) => {
    const { token, usuario, estadoPerfil, cargando, obtenerUrlRedireccion, tieneAccesoRuta } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [verificando, setVerificando] = useState(true);

    useEffect(() => {
        const verificarAcceso = async () => {
            // Si está cargando, esperar
            if (cargando) return;

            // Rutas públicas que no necesitan autenticación
            const rutasPublicas = ['/auth/login', '/auth/register', '/auth/forgot-password'];
            
            if (rutasPublicas.some(ruta => pathname.includes(ruta))) {
                // Si está en ruta pública pero está autenticado, redirigir
                if (token && usuario) {
                    const urlDestino = await obtenerUrlRedireccion();
                    router.push(urlDestino);
                    return;
                }
                setVerificando(false);
                return;
            }

            // Si no está autenticado, ir al login
            if (!token || !usuario) {
                router.push('/auth/login');
                return;
            }

            // Si el perfil está incompleto y no está en la ruta de completar perfil
            if (estadoPerfil === 'incomplete' && !pathname.includes('solicitudhomologacion')) {
                router.push('/homologaciones/solicitudhomologacion');
                return;
            }

            // Verificar roles específicos si se proporcionaron
            if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(usuario.rol_id)) {
                const urlDestino = await obtenerUrlRedireccion();
                router.push(urlDestino);
                return;
            }

            // Verificar acceso general a la ruta
            if (!tieneAccesoRuta(pathname)) {
                const urlDestino = await obtenerUrlRedireccion();
                router.push(urlDestino);
                return;
            }

            setVerificando(false);
        };

        verificarAcceso();
    }, [token, usuario, estadoPerfil, cargando, pathname, router, rolesPermitidos, obtenerUrlRedireccion, tieneAccesoRuta]);

    // Mostrar loading mientras verifica
    if (cargando || verificando) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return children;
};

export default ProteccionRuta;