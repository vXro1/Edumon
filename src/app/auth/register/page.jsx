'use client';

import { useState } from 'react';
import { Eye, EyeOff, Home, Mail, Lock, User, IdCard, Hash } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext'; 
import Swal from 'sweetalert2';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    tipo_identificacion: '',
    numero_identificacion: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const { login } = useAuth(); // Para usar el servicio de auth del contexto

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setMessage({ type: '', text: '' });
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar email
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del correo no es válido';
    }

    // Validar tipo de identificación
    if (!formData.tipo_identificacion) {
      newErrors.tipo_identificacion = 'Debe seleccionar un tipo de documento';
    }

    // Validar número de identificación
    if (!formData.numero_identificacion) {
      newErrors.numero_identificacion = 'El número de identificación es requerido';
    } else if (formData.numero_identificacion.length < 5 || !/^\d+$/.test(formData.numero_identificacion)) {
      newErrors.numero_identificacion = 'El número de documento debe tener al menos 5 dígitos y solo puede contener números';
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
      // Crear instancia del servicio de auth (similar al AuthService de tu código)
      const urlBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      
      const response = await fetch(`${urlBase}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || Object.values(data).join(', ') || 'Error en el registro');
      }

      // Mostrar mensaje de éxito con SweetAlert2
      await Swal.fire({
        title: 'Registro Exitoso',
        text: data.message || 'Usuario registrado correctamente. Revisa tu correo para obtener tus credenciales.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3b82f6'
      });

      // Limpiar formulario
      setFormData({
        email: '',
        tipo_identificacion: '',
        numero_identificacion: ''
      });

      // Redirigir a login después de un retraso
      setTimeout(() => {
        window.location.href = '/auth/login'; // O usar router.push('/auth/login')
      }, 3000);

    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Error en el registro. Inténtalo de nuevo.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tiposIdentificacion = [
    { value: '', label: 'Seleccione un tipo de documento', disabled: true },
    { value: 'Cédula de Ciudadanía', label: 'Cédula de Ciudadanía' },
    { value: 'Cédula de Extranjería', label: 'Cédula de Extranjería' },
    { value: 'Tarjeta de Identidad', label: 'Tarjeta de Identidad' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Efectos de fondo azules neumórficos (mantén los mismos del login) */}
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

      {/* Partículas flotantes con glow azul (mantén las mismas del login) */}
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

      {/* Botón Home */}
      <button
        onClick={() => window.location.href = '/'}
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

          {/* Header con imagen */}
          <div className="flex w-full rounded-t-3xl overflow-hidden">
            {/* Columna Izquierda: Imagen */}
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
                    src="/img/quime.png" // Ajusta la ruta según tu estructura de Next.js
                    alt="Quimerito"
                    className="w-28 h-28 object-contain rounded-full"
                    style={{
                      filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.5))',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Columna Derecha: Título */}
            <div 
              className="w-1/2 flex items-center justify-center p-8"
              style={{
                background: 'linear-gradient(145deg, #f8fafc, #f1f5f9)',
              }}
            >
              <h1 
                className="text-3xl font-bold text-blue-900 text-center"
                style={{
                  textShadow: '3px 3px 6px rgba(59, 130, 246, 0.3), -2px -2px 4px rgba(255, 255, 255, 0.8), 0 0 10px rgba(59, 130, 246, 0.2)',
                }}
              >
                REGISTRO
              </h1>
            </div>
          </div>

          {/* Contenedor del formulario */}
          <div className="p-8">

            {/* Mensajes de estado */}
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

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Campo de email */}
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

              {/* Campo de tipo de identificación */}
              <div className="space-y-3">
                <label 
                  htmlFor="tipo_identificacion" 
                  className="block text-sm font-semibold text-gray-700"
                  style={{
                    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8), 0 0 5px rgba(59, 130, 246, 0.1)',
                  }}
                >
                  Tipo de Identificación
                </label>
                <div className="relative">
                  <IdCard 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600" 
                    size={20}
                    style={{
                      filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.4))',
                    }}
                  />
                  <select
                    id="tipo_identificacion"
                    name="tipo_identificacion"
                    value={formData.tipo_identificacion}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-4 rounded-xl text-sm font-medium text-gray-700 border-none outline-none transition-all duration-300 ${
                      errors.tipo_identificacion ? 'text-red-600' : ''
                    }`}
                    style={{
                      background: 'linear-gradient(145deg, #f8fafc, #f1f5f9)',
                      boxShadow: errors.tipo_identificacion 
                        ? 'inset 8px 8px 16px rgba(239, 68, 68, 0.1), inset -8px -8px 16px rgba(255, 255, 255, 0.9), 0 0 10px rgba(239, 68, 68, 0.2)'
                        : 'inset 8px 8px 16px rgba(59, 130, 246, 0.08), inset -8px -8px 16px rgba(255, 255, 255, 0.9), 0 0 5px rgba(59, 130, 246, 0.1)',
                    }}
                    onFocus={(e) => {
                      e.target.style.boxShadow = 'inset 10px 10px 20px rgba(59, 130, 246, 0.15), inset -10px -10px 20px rgba(255, 255, 255, 0.9), 0 0 20px rgba(59, 130, 246, 0.3)';
                      e.target.style.background = 'linear-gradient(145deg, #eff6ff, #dbeafe)';
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = errors.tipo_identificacion 
                        ? 'inset 8px 8px 16px rgba(239, 68, 68, 0.1), inset -8px -8px 16px rgba(255, 255, 255, 0.9), 0 0 10px rgba(239, 68, 68, 0.2)'
                        : 'inset 8px 8px 16px rgba(59, 130, 246, 0.08), inset -8px -8px 16px rgba(255, 255, 255, 0.9), 0 0 5px rgba(59, 130, 246, 0.1)';
                      e.target.style.background = 'linear-gradient(145deg, #f8fafc, #f1f5f9)';
                    }}
                  >
                    {tiposIdentificacion.map((tipo) => (
                      <option 
                        key={tipo.value} 
                        value={tipo.value} 
                        disabled={tipo.disabled}
                      >
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.tipo_identificacion && (
                  <p className="text-red-500 text-xs mt-2 font-semibold ml-1">{errors.tipo_identificacion}</p>
                )}
              </div>

              {/* Campo de número de identificación */}
              <div className="space-y-3">
                <label 
                  htmlFor="numero_identificacion" 
                  className="block text-sm font-semibold text-gray-700"
                  style={{
                    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8), 0 0 5px rgba(59, 130, 246, 0.1)',
                  }}
                >
                  Número de Identificación
                </label>
                <div className="relative">
                  <Hash 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600" 
                    size={20}
                    style={{
                      filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.4))',
                    }}
                  />
                  <input
                    type="text"
                    id="numero_identificacion"
                    name="numero_identificacion"
                    value={formData.numero_identificacion}
                    onChange={handleInputChange}
                    placeholder="Ingrese su número de documento"
                    pattern="[0-9]{5,}"
                    title="Solo números, mínimo 5 dígitos"
                    inputMode="numeric"
                    className={`w-full pl-12 pr-4 py-4 rounded-xl text-sm font-medium text-gray-700 placeholder-gray-500 border-none outline-none transition-all duration-300 ${
                      errors.numero_identificacion ? 'text-red-600' : ''
                    }`}
                    style={{
                      background: 'linear-gradient(145deg, #f8fafc, #f1f5f9)',
                      boxShadow: errors.numero_identificacion 
                        ? 'inset 8px 8px 16px rgba(239, 68, 68, 0.1), inset -8px -8px 16px rgba(255, 255, 255, 0.9), 0 0 10px rgba(239, 68, 68, 0.2)'
                        : 'inset 8px 8px 16px rgba(59, 130, 246, 0.08), inset -8px -8px 16px rgba(255, 255, 255, 0.9), 0 0 5px rgba(59, 130, 246, 0.1)',
                    }}
                    onFocus={(e) => {
                      e.target.style.boxShadow = 'inset 10px 10px 20px rgba(59, 130, 246, 0.15), inset -10px -10px 20px rgba(255, 255, 255, 0.9), 0 0 20px rgba(59, 130, 246, 0.3)';
                      e.target.style.background = 'linear-gradient(145deg, #eff6ff, #dbeafe)';
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = errors.numero_identificacion 
                        ? 'inset 8px 8px 16px rgba(239, 68, 68, 0.1), inset -8px -8px 16px rgba(255, 255, 255, 0.9), 0 0 10px rgba(239, 68, 68, 0.2)'
                        : 'inset 8px 8px 16px rgba(59, 130, 246, 0.08), inset -8px -8px 16px rgba(255, 255, 255, 0.9), 0 0 5px rgba(59, 130, 246, 0.1)';
                      e.target.style.background = 'linear-gradient(145deg, #f8fafc, #f1f5f9)';
                    }}
                  />
                </div>
                {errors.numero_identificacion && (
                  <p className="text-red-500 text-xs mt-2 font-semibold ml-1">{errors.numero_identificacion}</p>
                )}
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
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
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div 
                      className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"
                      style={{
                        filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))',
                      }}
                    ></div>
                    <span style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}>Registrando...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <User size={20} />
                    <span style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.3), 2px 2px 4px rgba(0, 0, 0, 0.3)' }}>REGISTRARSE</span>
                  </div>
                )}
              </button>
            </form>

            {/* Enlaces de ayuda */}
            <div className="mt-8 text-center space-x-6 text-sm">
              <button
                onClick={() => window.location.href = '/auth/login'}
                className="font-medium text-blue-600 hover:text-blue-700 transition-all duration-200"
                style={{
                  textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8), 0 0 8px rgba(59, 130, 246, 0.3)',
                }}
              >
                ¿Ya tienes cuenta? Inicia sesión aquí
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