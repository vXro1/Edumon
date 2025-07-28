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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Efectos de fondo azules neumórficos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-30"
          style={{
            background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
            boxShadow: '0 0 80px rgba(59, 130, 246, 0.3), inset 20px 20px 40px rgba(147, 197, 253, 0.2)',
          }}
        ></div>
        <div 
          className="absolute top-1/4 -right-32 w-96 h-96 rounded-full opacity-25"
          style={{
            background: 'linear-gradient(135deg, #bfdbfe, #93c5fd)',
            boxShadow: '0 0 100px rgba(59, 130, 246, 0.4), inset 30px 30px 60px rgba(147, 197, 253, 0.3)',
          }}
        ></div>
        <div 
          className="absolute -bottom-32 left-1/3 w-72 h-72 rounded-full opacity-20"
          style={{
            background: 'linear-gradient(135deg, #93c5fd, #60a5fa)',
            boxShadow: '0 0 60px rgba(59, 130, 246, 0.5), inset 25px 25px 50px rgba(147, 197, 253, 0.4)',
          }}
        ></div>
      </div>

      {/* Partículas flotantes con glow azul */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full opacity-70"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              background: `radial-gradient(circle, #60a5fa, #3b82f6)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: `0 0 ${8 + Math.random() * 12}px rgba(59, 130, 246, 0.8), 0 0 ${4 + Math.random() * 6}px rgba(147, 197, 253, 0.6)`,
              animation: `float ${6 + Math.random() * 8}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Botón Home con sombras azules */}
      <button
        onClick={() => console.log('Navigate to home')}
        className="fixed top-5 right-5 w-14 h-14 rounded-2xl flex items-center justify-center z-50 text-blue-700 transition-all duration-300"
        style={{
          background: 'linear-gradient(145deg, #f8fafc, #e2e8f0)',
          boxShadow: '12px 12px 24px rgba(59, 130, 246, 0.15), -12px -12px 24px rgba(255, 255, 255, 0.9), inset 0 0 0 rgba(59, 130, 246, 0.1)',
        }}
        onMouseEnter={(e) => {
          e.target.style.boxShadow = 'inset 6px 6px 12px rgba(59, 130, 246, 0.1), inset -6px -6px 12px rgba(255, 255, 255, 0.9), 0 0 20px rgba(59, 130, 246, 0.3)';
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.boxShadow = '12px 12px 24px rgba(59, 130, 246, 0.15), -12px -12px 24px rgba(255, 255, 255, 0.9)';
          e.target.style.transform = 'scale(1)';
        }}
      >
        <Home size={22} strokeWidth={2.5} />
      </button>

      {/* Container principal del formulario */}
      <div className="w-full max-w-md">
        <div 
          className="rounded-3xl overflow-hidden backdrop-blur-sm"
          style={{
            background: 'linear-gradient(145deg, rgba(248, 250, 252, 0.95), rgba(241, 245, 249, 0.90))',
            boxShadow: '25px 25px 50px rgba(59, 130, 246, 0.15), -25px -25px 50px rgba(255, 255, 255, 0.9), 0 0 40px rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(147, 197, 253, 0.2)',
          }}
        >

          {/* Header con imagen de quime */}
          <div className="flex w-full rounded-t-3xl overflow-hidden">
            {/* Columna Izquierda: Imagen con gradiente azul */}
            <div 
              className="w-1/2 flex items-center justify-center p-8 relative"
              style={{
                background: 'linear-gradient(135deg, #1e40af, #3b82f6, #06b6d4)',
                boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.2)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-600/30"></div>
              <div className="relative z-10">
                <div 
                  className="w-32 h-32 rounded-full p-2 backdrop-blur-sm flex items-center justify-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 0 30px rgba(255, 255, 255, 0.3), inset 4px 4px 8px rgba(255, 255, 255, 0.2), inset -4px -4px 8px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <img
                    src="img/quime.png"
                    alt="Quimerito"
                    className="w-28 h-28 object-contain rounded-full"
                    style={{
                      filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.5))',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Columna Derecha: Título con sombras azules */}
            <div 
              className="w-1/2 flex items-center justify-center p-8"
              style={{
                background: 'linear-gradient(145deg, #f8fafc, #f1f5f9)',
              }}
            >
              <h1 
                className="text-3xl font-bold text-blue-900"
                style={{
                  textShadow: '3px 3px 6px rgba(59, 130, 246, 0.3), -2px -2px 4px rgba(255, 255, 255, 0.8), 0 0 10px rgba(59, 130, 246, 0.2)',
                }}
              >
                INICIAR SESIÓN
              </h1>
            </div>
          </div>

          {/* Contenedor del formulario */}
          <div className="p-8">

            {/* Mensajes de estado con sombras azules */}
            {message.text && (
              <div 
                className={`p-4 rounded-xl mb-6 text-sm font-medium ${
                  message.type === 'error' ? 'text-red-700' : 'text-green-700'
                }`}
                style={{
                  background: message.type === 'error' 
                    ? 'linear-gradient(145deg, #fef2f2, #fee2e2)'
                    : 'linear-gradient(145deg, #f0fdf4, #dcfce7)',
                  boxShadow: message.type === 'error' 
                    ? 'inset 6px 6px 12px rgba(239, 68, 68, 0.1), inset -6px -6px 12px rgba(255, 255, 255, 0.9), 0 0 15px rgba(239, 68, 68, 0.1)'
                    : 'inset 6px 6px 12px rgba(34, 197, 94, 0.1), inset -6px -6px 12px rgba(255, 255, 255, 0.9), 0 0 15px rgba(34, 197, 94, 0.1)',
                }}
              >
                {message.text}
              </div>
            )}

            <div className="space-y-6">

              {/* Campo de email con sombras azules */}
              <div className="space-y-3">
                <label 
                  htmlFor="email" 
                  className="block text-sm font-semibold text-gray-700"
                  style={{
                    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8), 0 0 5px rgba(59, 130, 246, 0.1)',
                  }}
                >
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600" 
                    size={20}
                    style={{
                      filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.4))',
                    }}
                  />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tu.correo@electronico.edu.co"
                    className={`w-full pl-12 pr-4 py-4 rounded-xl text-sm font-medium text-gray-700 placeholder-gray-500 border-none outline-none transition-all duration-300 ${
                      errors.email ? 'text-red-600' : ''
                    }`}
                    style={{
                      background: 'linear-gradient(145deg, #f8fafc, #f1f5f9)',
                      boxShadow: errors.email 
                        ? 'inset 8px 8px 16px rgba(239, 68, 68, 0.1), inset -8px -8px 16px rgba(255, 255, 255, 0.9), 0 0 10px rgba(239, 68, 68, 0.2)'
                        : 'inset 8px 8px 16px rgba(59, 130, 246, 0.08), inset -8px -8px 16px rgba(255, 255, 255, 0.9), 0 0 5px rgba(59, 130, 246, 0.1)',
                    }}
                    onFocus={(e) => {
                      e.target.style.boxShadow = 'inset 10px 10px 20px rgba(59, 130, 246, 0.15), inset -10px -10px 20px rgba(255, 255, 255, 0.9), 0 0 20px rgba(59, 130, 246, 0.3)';
                      e.target.style.background = 'linear-gradient(145deg, #eff6ff, #dbeafe)';
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = errors.email 
                        ? 'inset 8px 8px 16px rgba(239, 68, 68, 0.1), inset -8px -8px 16px rgba(255, 255, 255, 0.9), 0 0 10px rgba(239, 68, 68, 0.2)'
                        : 'inset 8px 8px 16px rgba(59, 130, 246, 0.08), inset -8px -8px 16px rgba(255, 255, 255, 0.9), 0 0 5px rgba(59, 130, 246, 0.1)';
                      e.target.style.background = 'linear-gradient(145deg, #f8fafc, #f1f5f9)';
                    }}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-2 font-semibold ml-1">{errors.email}</p>
                )}
              </div>

              {/* Campo de contraseña con sombras azules */}
              <div className="space-y-3">
                <label 
                  htmlFor="password" 
                  className="block text-sm font-semibold text-gray-700"
                  style={{
                    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8), 0 0 5px rgba(59, 130, 246, 0.1)',
                  }}
                >
                  Contraseña
                </label>
                <div className="relative">
                  <Lock 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600" 
                    size={20}
                    style={{
                      filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.4))',
                    }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Ingrese su contraseña"
                    className={`w-full pl-12 pr-12 py-4 rounded-xl text-sm font-medium text-gray-700 placeholder-gray-500 border-none outline-none transition-all duration-300 ${
                      errors.password ? 'text-red-600' : ''
                    }`}
                    style={{
                      background: 'linear-gradient(145deg, #f8fafc, #f1f5f9)',
                      boxShadow: errors.password 
                        ? 'inset 8px 8px 16px rgba(239, 68, 68, 0.1), inset -8px -8px 16px rgba(255, 255, 255, 0.9), 0 0 10px rgba(239, 68, 68, 0.2)'
                        : 'inset 8px 8px 16px rgba(59, 130, 246, 0.08), inset -8px -8px 16px rgba(255, 255, 255, 0.9), 0 0 5px rgba(59, 130, 246, 0.1)',
                    }}
                    onFocus={(e) => {
                      e.target.style.boxShadow = 'inset 10px 10px 20px rgba(59, 130, 246, 0.15), inset -10px -10px 20px rgba(255, 255, 255, 0.9), 0 0 20px rgba(59, 130, 246, 0.3)';
                      e.target.style.background = 'linear-gradient(145deg, #eff6ff, #dbeafe)';
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = errors.password 
                        ? 'inset 8px 8px 16px rgba(239, 68, 68, 0.1), inset -8px -8px 16px rgba(255, 255, 255, 0.9), 0 0 10px rgba(239, 68, 68, 0.2)'
                        : 'inset 8px 8px 16px rgba(59, 130, 246, 0.08), inset -8px -8px 16px rgba(255, 255, 255, 0.9), 0 0 5px rgba(59, 130, 246, 0.1)';
                      e.target.style.background = 'linear-gradient(145deg, #f8fafc, #f1f5f9)';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 transition-all duration-200"
                    style={{
                      filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.4))',
                    }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-2 font-semibold ml-1">{errors.password}</p>
                )}
              </div>

              {/* Checkbox neumórfico con azules */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="remember"
                      name="remember"
                      checked={formData.remember}
                      onChange={handleInputChange}
                      className="w-5 h-5 opacity-0 absolute"
                    />
                    <div 
                      className={`w-5 h-5 rounded-lg cursor-pointer transition-all duration-300`}
                      style={{
                        background: formData.remember 
                          ? 'linear-gradient(145deg, #dbeafe, #bfdbfe)'
                          : 'linear-gradient(145deg, #f8fafc, #f1f5f9)',
                        boxShadow: formData.remember 
                          ? 'inset 4px 4px 8px rgba(59, 130, 246, 0.2), inset -4px -4px 8px rgba(255, 255, 255, 0.9), 0 0 10px rgba(59, 130, 246, 0.3)'
                          : '4px 4px 8px rgba(59, 130, 246, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9), 0 0 5px rgba(59, 130, 246, 0.1)',
                      }}
                      onClick={() => setFormData(prev => ({ ...prev, remember: !prev.remember }))}
                    >
                      {formData.remember && (
                        <div className="flex items-center justify-center h-full">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{
                              background: 'radial-gradient(circle, #3b82f6, #1d4ed8)',
                              boxShadow: '0 0 6px rgba(59, 130, 246, 0.6)',
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <label htmlFor="remember" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer select-none">
                    Recordar mis datos
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => console.log('Forgot password')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  style={{
                    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8), 0 0 5px rgba(59, 130, 246, 0.2)',
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Botón de envío con sombras azules espectaculares */}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-xl font-bold text-lg tracking-wide relative overflow-hidden text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: isLoading 
                    ? 'linear-gradient(145deg, #64748b, #475569)'
                    : 'linear-gradient(145deg, #3b82f6, #1d4ed8, #06b6d4)',
                  boxShadow: isLoading 
                    ? 'inset 10px 10px 20px rgba(71, 85, 105, 0.3), inset -10px -10px 20px rgba(148, 163, 184, 0.1), 0 0 20px rgba(59, 130, 246, 0.2)'
                    : '12px 12px 24px rgba(59, 130, 246, 0.4), -12px -12px 24px rgba(255, 255, 255, 0.6), 0 0 30px rgba(59, 130, 246, 0.3), inset 0 0 0 rgba(255, 255, 255, 0.1)',
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = 'scale(1.03)';
                    e.target.style.boxShadow = '15px 15px 30px rgba(59, 130, 246, 0.5), -15px -15px 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(59, 130, 246, 0.5), inset 2px 2px 4px rgba(255, 255, 255, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '12px 12px 24px rgba(59, 130, 246, 0.4), -12px -12px 24px rgba(255, 255, 255, 0.6), 0 0 30px rgba(59, 130, 246, 0.3)';
                  }
                }}
                onMouseDown={(e) => {
                  if (!isLoading) {
                    e.target.style.boxShadow = 'inset 8px 8px 16px rgba(29, 78, 216, 0.3), inset -8px -8px 16px rgba(96, 165, 250, 0.1), 0 0 25px rgba(59, 130, 246, 0.4)';
                  }
                }}
                onMouseUp={(e) => {
                  if (!isLoading) {
                    e.target.style.boxShadow = '12px 12px 24px rgba(59, 130, 246, 0.4), -12px -12px 24px rgba(255, 255, 255, 0.6), 0 0 30px rgba(59, 130, 246, 0.3)';
                  }
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div 
                      className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"
                      style={{
                        filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))',
                      }}
                    ></div>
                    <span style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}>Ingresando...</span>
                  </div>
                ) : (
                  <span style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.3), 2px 2px 4px rgba(0, 0, 0, 0.3)' }}>INGRESAR</span>
                )}
              </button>
            </div>

            {/* Enlaces de ayuda con sombras azules */}
            <div className="mt-8 text-center space-x-6 text-sm">
              <button
                onClick={() => console.log('Navigate to register')}
                className="font-medium text-blue-600 hover:text-blue-700 transition-all duration-200"
                style={{
                  textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8), 0 0 8px rgba(59, 130, 246, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.textShadow = '1px 1px 2px rgba(255, 255, 255, 0.8), 0 0 12px rgba(59, 130, 246, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.textShadow = '1px 1px 2px rgba(255, 255, 255, 0.8), 0 0 8px rgba(59, 130, 246, 0.3)';
                }}
              >
                Regístrate Aquí
              </button>
              <span className="text-gray-400 font-light">|</span>
              <button
                onClick={() => console.log('Navigate to support')}
                className="font-medium text-blue-600 hover:text-blue-700 transition-all duration-200"
                style={{
                  textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8), 0 0 8px rgba(59, 130, 246, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.textShadow = '1px 1px 2px rgba(255, 255, 255, 0.8), 0 0 12px rgba(59, 130, 246, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.textShadow = '1px 1px 2px rgba(255, 255, 255, 0.8), 0 0 8px rgba(59, 130, 246, 0.3)';
                }}
              >
                Contactar Soporte
              </button>
            </div>
          </div>

          {/* Footer con sombras azules */}
          <div 
            className="px-8 py-6 text-center text-xs text-gray-600 font-medium"
            style={{
              background: 'linear-gradient(145deg, #f1f5f9, #e2e8f0)',
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8), 0 0 5px rgba(59, 130, 246, 0.1)',
              boxShadow: 'inset 0 2px 4px rgba(59, 130, 246, 0.1), 0 0 10px rgba(59, 130, 246, 0.05)',
            }}
          >
            Corporacion Universitaria Autónoma del Cauca © 2025 - Sistema de Homologaciones
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.7;
          }
          33% { 
            transform: translateY(-15px) rotate(120deg); 
            opacity: 1;
          }
          66% { 
            transform: translateY(8px) rotate(240deg); 
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}