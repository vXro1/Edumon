'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export const useAuthRedirect = () => {
    const { estaAutenticado, obtenerUrlRedireccion } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (estaAutenticado) {
            obtenerUrlRedireccion().then(url => {
                router.push(url);
            });
        }
    }, [estaAutenticado, obtenerUrlRedireccion, router]);
};