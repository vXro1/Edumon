'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [usuario, setUsuario] = useState(null);
    const [estadoPerfil, setEstadoPerfil] = useState(null);
    const [cargando, setCargando] = useState(true);
    const router = useRouter();
    
    const urlBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

    // Cargar datos del localStorage al inicializar
    useEffect(() => {
        const tokenGuardado = localStorage.getItem('auth_token');
        const usuarioGuardado = localStorage.getItem('user_data');
        const estadoGuardado = localStorage.getItem('profile_status');

        if (tokenGuardado) {
            setToken(tokenGuardado);
        }
        if (usuarioGuardado) {
            setUsuario(JSON.parse(usuarioGuardado));
        }
        if (estadoGuardado) {
            setEstadoPerfil(estadoGuardado);
        }

        setCargando(false);
    }, []);

    // Función para hacer login - CAMBIÉ EL NOMBRE AQUÍ
    const login = async (email, password, recordar = false) => {
        try {
            const response = await fetch(`${urlBase}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const datos = await response.json();

            if (!response.ok) {
                throw new Error(datos.error || 'Error en la autenticación');
            }

            // Guardar token y usuario
            setToken(datos.access_token);
            setUsuario(datos.user);
            localStorage.setItem('auth_token', datos.access_token);
            localStorage.setItem('user_data', JSON.stringify(datos.user));

            // Verificar estado del perfil
            await verificarEstadoPerfil();

            // Redirigir después del login exitoso
            const urlDestino = await obtenerUrlRedireccion();
            router.push(urlDestino);

            return datos;
        } catch (error) {
            console.error('Error durante login:', error);
            throw error;
        }
    };

    // Función para verificar estado del perfil
    const verificarEstadoPerfil = async () => {
        try {
            if (!token) {
                console.log("No hay token, perfil considerado incompleto");
                setEstadoPerfil('incomplete');
                localStorage.setItem('profile_status', 'incomplete');
                return false;
            }

            // Obtener datos actualizados del usuario
            let datosUsuario;
            try {
                datosUsuario = await obtenerPerfilUsuario();
            } catch (error) {
                console.error("Error obteniendo datos de usuario de la API, usando datos locales");
                datosUsuario = usuario;
            }

            const usuarioActual = datosUsuario || usuario;

            if (!usuarioActual) {
                console.log("No hay datos de usuario, perfil considerado incompleto");
                setEstadoPerfil('incomplete');
                localStorage.setItem('profile_status', 'incomplete');
                return false;
            }

            // Verificar campos necesarios
            const camposRequeridos = ['primer_nombre', 'primer_apellido'];
            const camposFaltantes = [];

            for (const campo of camposRequeridos) {
                if (!usuarioActual[campo]) {
                    camposFaltantes.push(campo);
                }
            }

            const estaCompleto = camposFaltantes.length === 0;
            const estado = estaCompleto ? 'complete' : 'incomplete';

            setEstadoPerfil(estado);
            localStorage.setItem('profile_status', estado);

            console.log("Estado del perfil:", estaCompleto ? "COMPLETO" : "INCOMPLETO");
            return estaCompleto;
        } catch (error) {
            console.error('Error verificando estado del perfil:', error);
            setEstadoPerfil('incomplete');
            localStorage.setItem('profile_status', 'incomplete');
            return false;
        }
    };

    // Función para obtener perfil del usuario
    const obtenerPerfilUsuario = async () => {
        try {
            if (!token) {
                throw new Error('No hay sesión activa');
            }

            const response = await fetch(`${urlBase}/auth/user-profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const datos = await response.json();

            if (!response.ok) {
                throw new Error(datos.error || 'Error al obtener perfil');
            }

            // Actualizar usuario
            setUsuario(datos);
            localStorage.setItem('user_data', JSON.stringify(datos));

            return datos;
        } catch (error) {
            console.error('Error al obtener perfil:', error);
            throw error;
        }
    };

    // Función para determinar URL de redirección
    const obtenerUrlRedireccion = async () => {
        try {
            if (!usuario) {
                return '/auth/login';
            }

            // Verificar estado del perfil
            const perfilCompleto = await verificarEstadoPerfil();

            if (!perfilCompleto) {
                return '/homologaciones/solicitudhomologacion';
            }

            // Redirigir según rol
            const rolId = usuario.rol_id;

            switch (rolId) {
                case 1: // Aspirante
                    return '/homologaciones/aspirante';
                case 2: // Coordinador
                    return '/coordinador/inicio';
                case 3: // Administrador
                    return '/administrador';
                default:
                    return '/homologaciones/aspirante';
            }
        } catch (error) {
            console.error("Error en obtenerUrlRedireccion:", error);
            return '/auth/login';
        }
    };

    // Función para cerrar sesión
    const cerrarSesion = async () => {
        try {
            if (token) {
                await fetch(`${urlBase}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });
            }
        } catch (error) {
            console.error('Error durante logout:', error);
        } finally {
            // Limpiar todo
            setToken(null);
            setUsuario(null);
            setEstadoPerfil(null);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            localStorage.removeItem('profile_status');
            
            router.push('/auth/login');
        }
    };

    // Función para peticiones autenticadas
    const peticionAutenticada = async (url, opciones = {}) => {
        if (!token) {
            throw new Error('No hay sesión activa');
        }

        const opcionesPorDefecto = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        };

        const opcionesFinal = {
            ...opcionesPorDefecto,
            ...opciones,
            headers: {
                ...opcionesPorDefecto.headers,
                ...opciones.headers
            }
        };

        try {
            const response = await fetch(`${urlBase}${url}`, opcionesFinal);
            const datos = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    // Token expirado
                    await cerrarSesion();
                    throw new Error('Sesión expirada');
                }
                throw new Error(datos.error || 'Error en la petición');
            }

            return datos;
        } catch (error) {
            console.error('Error en petición autenticada:', error);
            throw error;
        }
    };

    // Verificar si tiene acceso a una ruta
    const tieneAccesoRuta = (ruta) => {
        if (!usuario || !usuario.rol_id) {
            return false;
        }

        const rolId = usuario.rol_id;

        // Mapeo de rutas por rol
        const rutasPermitidas = {
            1: [ // Aspirante
                '/homologaciones/aspirante',
                '/homologaciones/solicitudhomologacion'
            ],
            2: [ // Coordinador
                '/coordinador/inicio',
                '/coordinador'
            ],
            3: [ // Administrador
                '/administrador',
                '/admin'
            ]
        };

        // Rutas generales para todos
        const rutasGenerales = [
            '/perfil',
            '/cambiar-password',
            '/auth/logout'
        ];

        if (rutasGenerales.some(r => ruta === r || ruta.startsWith(r + '/'))) {
            return true;
        }

        if (!rutasPermitidas[rolId]) {
            return false;
        }

        return rutasPermitidas[rolId].some(rutaPermitida => {
            return ruta === rutaPermitida || ruta.startsWith(rutaPermitida + '/');
        });
    };

    const valor = {
        token,
        usuario,
        estadoPerfil,
        cargando,
        login, // ESTE ES EL NOMBRE CORRECTO
        cerrarSesion,
        verificarEstadoPerfil,
        obtenerPerfilUsuario,
        obtenerUrlRedireccion,
        peticionAutenticada,
        tieneAccesoRuta,
        isAuthenticated: !!token // AGREGUÉ ESTE ALIAS PARA COMPATIBILIDAD
    };

    return (
        <AuthContext.Provider value={valor}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};