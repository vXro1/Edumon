'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Home, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigation = (path) => {
    console.log(`Navigating to: ${path}`);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setMessage({ type: '', text: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del correo no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage({
        type: 'success',
        text: '¡Inicio de sesión exitoso! Redirigiendo...'
      });

      setTimeout(() => {
        console.log('Redirecting to coordinator dashboard...');
      }, 2000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error al iniciar sesión. Inténtalo de nuevo.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-50 to-blue-200">
      
      {/* Elementos decorativos sutiles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Círculos flotantes minimalistas */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`circle-${i}`}
            className="absolute rounded-full opacity-10 animate-pulse"
            style={{
              width: `${100 + Math.random() * 200}px`,
              height: `${100 + Math.random() * 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${
                i % 2 === 0 ? '#3b82f6' : '#6366f1'
              }20 0%, transparent 70%)`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          />
        ))}

        {/* Líneas sutiles */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}
          />
        </div>
      </div>

      {/* Botón Home neumórfico */}
      <button
        onClick={() => handleNavigation('/src/page.jsx')}
        className="fixed top-6 right-6 w-14 h-14 rounded-2xl flex items-center justify-center z-50 transition-all duration-300 hover:scale-105 group bg-blue-50"
        style={{
          boxShadow: `
            8px 8px 16px rgba(59, 130, 246, 0.15),
            -8px -8px 16px rgba(255, 255, 255, 0.9),
            inset 2px 2px 4px rgba(255, 255, 255, 0.8),
            inset -2px -2px 4px rgba(59, 130, 246, 0.1)
          `
        }}
      >
        <Home size={20} className="text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
      </button>

      {/* Container principal neumórfico */}
      <div 
        className={`w-full max-w-md rounded-3xl overflow-hidden relative transition-all duration-1000 bg-blue-50 ${
          mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
        }`}
        style={{
          boxShadow: `
            25px 25px 50px rgba(59, 130, 246, 0.2),
            -25px -25px 50px rgba(255, 255, 255, 0.9),
            inset 3px 3px 6px rgba(255, 255, 255, 0.8),
            inset -3px -3px 6px rgba(59, 130, 246, 0.1)
          `
        }}
      >
        
        {/* Header minimalista */}
        <div className="p-8 text-center relative bg-gradient-to-b from-blue-100 to-blue-50">
          {/* Logo container neumórfico */}
          <div 
            className="mx-auto mb-6 w-20 h-20 rounded-2xl flex items-center justify-center relative bg-blue-50"
            style={{
              boxShadow: `
                12px 12px 24px rgba(59, 130, 246, 0.2),
                -12px -12px 24px rgba(255, 255, 255, 0.9),
                inset 4px 4px 8px rgba(255, 255, 255, 0.8),
                inset -4px -4px 8px rgba(59, 130, 246, 0.15)
              `
            }}
          >
            <img
              src="img/quime.png"
              alt="Logo Universidad Autónoma del Cauca"
              className="w-12 h-12 object-contain filter brightness-110"
            />
          </div>
          
          <h1 className="text-blue-700 text-sm font-semibold tracking-wide mb-2">
            UNIVERSIDAD AUTÓNOMA DEL CAUCA
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 mx-auto rounded-full shadow-lg" />
        </div>

        {/* Contenido del formulario */}
        <div className="p-8 bg-blue-50">
          {/* Título */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-blue-600 text-sm font-medium">
              Sistema de Homologaciones
            </p>
          </div>

          {/* Mensaje de estado */}
          {message.text && (
            <div 
              className={`p-4 rounded-2xl mb-6 text-sm font-medium transition-all duration-300 ${
                message.type === 'error' 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-green-100 text-green-700'
              }`}
              style={{
                boxShadow: message.type === 'error' 
                  ? `inset 6px 6px 12px rgba(239, 68, 68, 0.1), inset -6px -6px 12px rgba(255, 255, 255, 0.8)`
                  : `inset 6px 6px 12px rgba(34, 197, 94, 0.1), inset -6px -6px 12px rgba(255, 255, 255, 0.8)`
              }}
            >
              {message.text}
            </div>
          )}

          {/* Formulario */}
          <div className="space-y-6">
            {/* Campo de email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-blue-700 mb-3">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500" size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="correo@unicauca.edu.co"
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-medium transition-all duration-300 focus:outline-none bg-blue-50 ${
                    errors.email 
                      ? 'text-red-600' 
                      : 'text-blue-800 focus:text-blue-900'
                  }`}
                  style={{
                    boxShadow: errors.email 
                      ? `inset 8px 8px 16px rgba(239, 68, 68, 0.15), inset -8px -8px 16px rgba(255, 255, 255, 0.8)`
                      : `inset 8px 8px 16px rgba(59, 130, 246, 0.1), inset -8px -8px 16px rgba(255, 255, 255, 0.8)`
                  }}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-2 ml-1 animate-pulse">{errors.email}</p>
              )}
            </div>

            {/* Campo de contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-blue-700 mb-3">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-4 rounded-2xl text-sm font-medium transition-all duration-300 focus:outline-none bg-blue-50 ${
                    errors.password 
                      ? 'text-red-600' 
                      : 'text-blue-800 focus:text-blue-900'
                  }`}
                  style={{
                    boxShadow: errors.password 
                      ? `inset 8px 8px 16px rgba(239, 68, 68, 0.15), inset -8px -8px 16px rgba(255, 255, 255, 0.8)`
                      : `inset 8px 8px 16px rgba(59, 130, 246, 0.1), inset -8px -8px 16px rgba(255, 255, 255, 0.8)`
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-2 ml-1 animate-pulse">{errors.password}</p>
              )}
            </div>

            {/* Checkbox neumórfico */}
            <div className="flex items-center">
              <div 
                className="relative w-5 h-5 mr-3 rounded cursor-pointer bg-blue-50"
                style={{
                  boxShadow: `
                    inset 4px 4px 8px rgba(59, 130, 246, 0.15),
                    inset -4px -4px 8px rgba(255, 255, 255, 0.8)
                  `
                }}
                onClick={() => setFormData(prev => ({ ...prev, remember: !prev.remember }))}
              >
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                {formData.remember && (
                  <div className="absolute inset-1 bg-blue-500 rounded-sm" />
                )}
              </div>
              <label htmlFor="remember" className="text-sm font-medium text-blue-700 cursor-pointer select-none">
                Recordar mis datos
              </label>
            </div>

            {/* Botón de envío neumórfico */}
            <div
              onClick={handleSubmit}
              className="w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 cursor-pointer relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-center"
              style={{
                boxShadow: `
                  12px 12px 24px rgba(59, 130, 246, 0.3),
                  -4px -4px 12px rgba(255, 255, 255, 0.2),
                  inset 2px 2px 4px rgba(255, 255, 255, 0.2),
                  inset -2px -2px 4px rgba(59, 130, 246, 0.2)
                `
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Ingresando...</span>
                </div>
              ) : (
                'INGRESAR'
              )}
            </div>
          </div>

          {/* Enlaces de ayuda */}
          <div className="mt-8 text-center flex items-center justify-center gap-6 text-sm">
            <button
              onClick={() => handleNavigation('/registro')}
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              Regístrate Aquí
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => handleNavigation('/src/page.jsx')}
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              Contactar Soporte
            </button>
          </div>
        </div>

        {/* Footer minimalista */}
        <div className="px-8 py-6 text-center text-xs text-blue-600 font-medium bg-gradient-to-t from-blue-100 to-blue-50">
          <p>Autónoma del Cauca © 2025 - Sistema de Homologaciones</p>
        </div>
      </div>
    </div>
  );
}