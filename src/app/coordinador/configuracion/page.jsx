'use client'

import SidebarLayout from '../../../layouts/SidebarLayout'
import { useState, useEffect } from 'react'
import { 
  Settings, 
  User,
  Lock,
  Bell,
  Moon,
  Sun,
  Monitor,
  Save,
  Eye,
  EyeOff,
  Camera,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Shield,
  Loader2,
  AlertCircle,
  CheckCircle,
  Edit,
  X,
  Check,
  RefreshCw
} from 'lucide-react'

export default function ConfiguracionVista() {
  // Estados para datos del usuario
  const [usuario, setUsuario] = useState(null)
  const [usuarioEditado, setUsuarioEditado] = useState(null)
  
  // Estados de UI
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [mensajeExito, setMensajeExito] = useState('')
  
  // Estados de configuración
  const [modoOscuro, setModoOscuro] = useState('light')
  const [notificaciones, setNotificaciones] = useState({
    email: true,
    push: false,
    solicitudesNuevas: true,
    recordatorios: true
  })
  
  // Estados de edición
  const [modoEdicion, setModoEdicion] = useState(false)
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [nuevaPassword, setNuevaPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [passwordActual, setPasswordActual] = useState('')
  
  // Estados de validación
  const [erroresValidacion, setErroresValidacion] = useState({})

  // Obtener datos seguros
  const obtenerDatoSeguro = (valor, fallback) => {
    return valor && valor.toString().trim() !== '' ? valor : fallback
  }

  // Formatear fecha
  const formatearFecha = (fechaString) => {
    if (!fechaString) return 'Fecha no encontrada'
    try {
      return new Date(fechaString).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Fecha inválida'
    }
  }

  // Cargar datos del usuario (simulando ID = 7 para coordinador)
  const cargarUsuario = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Primero obtener todos los usuarios para encontrar el coordinador
      const responseUsuarios = await fetch('http://127.0.0.1:8000/api/usuarios')
      if (!responseUsuarios.ok) {
        throw new Error('Error al cargar usuarios')
      }
      
      const usuarios = await responseUsuarios.json()
      const coordinador = usuarios.find(user => user.rol === 'Coordinador')
      
      if (!coordinador) {
        throw new Error('No se encontró un coordinador activo')
      }
      
      // Obtener datos específicos del usuario por ID
      const responseUsuario = await fetch(`http://127.0.0.1:8000/api/usuarios/${coordinador.id_usuario}`)
      if (!responseUsuario.ok) {
        throw new Error('Error al cargar datos del usuario')
      }
      
      const datosUsuario = await responseUsuario.json()
      
      if (datosUsuario.datos) {
        setUsuario(datosUsuario.datos)
        setUsuarioEditado({ ...datosUsuario.datos })
      } else {
        throw new Error('Estructura de datos inesperada')
      }
      
    } catch (error) {
      console.error('Error cargando usuario:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Aplicar modo oscuro
  const aplicarModoOscuro = (modo) => {
    setModoOscuro(modo)
    
    const root = document.documentElement
    
    if (modo === 'dark') {
      root.classList.add('dark')
      root.style.setProperty('--azul-oscuro', '#1e3a8a')
      root.style.setProperty('--azul-medio', '#3b82f6')
      root.style.setProperty('--azul-claro', '#60a5fa')
      root.style.setProperty('--gris-claro', '#1f2937')
      root.style.setProperty('--gris-medio', '#374151')
      root.style.setProperty('--blanco', '#111827')
      root.style.setProperty('--negro', '#f9fafb')
    } else if (modo === 'light') {
      root.classList.remove('dark')
      root.style.setProperty('--azul-oscuro', '#19407b')
      root.style.setProperty('--azul-medio', '#0075bf')
      root.style.setProperty('--azul-claro', '#08dcff')
      root.style.setProperty('--gris-claro', '#f8fafc')
      root.style.setProperty('--gris-medio', '#e2e8f0')
      root.style.setProperty('--blanco', '#ffffff')
      root.style.setProperty('--negro', '#1f2937')
    } else {
      // Modo sistema
      const esOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches
      aplicarModoOscuro(esOscuro ? 'dark' : 'light')
    }
    
    localStorage.setItem('modo-tema', modo)
  }

  // Validar campos
  const validarCampos = () => {
    const errores = {}
    
    if (!usuarioEditado.primer_nombre?.trim()) {
      errores.primer_nombre = 'El primer nombre es requerido'
    }
    
    if (!usuarioEditado.primer_apellido?.trim()) {
      errores.primer_apellido = 'El primer apellido es requerido'
    }
    
    if (!usuarioEditado.email?.trim()) {
      errores.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(usuarioEditado.email)) {
      errores.email = 'El email no es válido'
    }
    
    if (!usuarioEditado.telefono?.trim()) {
      errores.telefono = 'El teléfono es requerido'
    }
    
    if (nuevaPassword && nuevaPassword !== confirmarPassword) {
      errores.password = 'Las contraseñas no coinciden'
    }
    
    if (nuevaPassword && nuevaPassword.length < 6) {
      errores.password = 'La contraseña debe tener al menos 6 caracteres'
    }
    
    setErroresValidacion(errores)
    return Object.keys(errores).length === 0
  }

  // Guardar cambios
  const guardarCambios = async () => {
    if (!validarCampos()) return
    
    try {
      setGuardando(true)
      
      // Simular guardado (aquí iría la llamada real a la API)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setUsuario({ ...usuarioEditado })
      setModoEdicion(false)
      setMensajeExito('Configuración guardada exitosamente')
      
      // Limpiar campos de contraseña
      setNuevaPassword('')
      setConfirmarPassword('')
      setPasswordActual('')
      
      setTimeout(() => {
        setMensajeExito('')
      }, 3000)
      
    } catch (error) {
      console.error('Error guardando cambios:', error)
      setError('Error al guardar los cambios')
    } finally {
      setGuardando(false)
    }
  }

  // Cancelar edición
  const cancelarEdicion = () => {
    setUsuarioEditado({ ...usuario })
    setModoEdicion(false)
    setErroresValidacion({})
    setNuevaPassword('')
    setConfirmarPassword('')
    setPasswordActual('')
  }

  // Cargar configuración inicial
  useEffect(() => {
    cargarUsuario()
    
    // Cargar modo oscuro guardado
    const modoGuardado = localStorage.getItem('modo-tema') || 'light'
    aplicarModoOscuro(modoGuardado)
  }, [])

  // Configurar usuario para sidebar
  const currentUser = {
    name: usuario ? 
      `${obtenerDatoSeguro(usuario.primer_nombre, 'Nombre')} ${obtenerDatoSeguro(usuario.primer_apellido, 'Apellido')}` :
      'Usuario no encontrado',
    email: usuario ? 
      obtenerDatoSeguro(usuario.email, 'Email no encontrado') :
      'Email no encontrado'
  }

  // Componente de campo editable
  const CampoEditable = ({ label, value, field, type = 'text', placeholder, icono: IconComponent, required = false }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-azul-oscuro dark:text-azul-claro">
        <div className="flex items-center space-x-2">
          {IconComponent && <IconComponent className="w-4 h-4" />}
          <span>{label} {required && <span className="text-red-500">*</span>}</span>
        </div>
      </label>
      {modoEdicion ? (
        <div>
          <input
            type={type}
            value={usuarioEditado[field] || ''}
            onChange={(e) => setUsuarioEditado({ ...usuarioEditado, [field]: e.target.value })}
            placeholder={placeholder}
            className={`w-full neu-input focus:ring-2 focus:ring-azul-claro/50 ${
              erroresValidacion[field] ? 'border-red-500 ring-red-200' : ''
            }`}
          />
          {erroresValidacion[field] && (
            <p className="text-red-500 text-xs mt-1">{erroresValidacion[field]}</p>
          )}
        </div>
      ) : (
        <div className="neu-card p-3 bg-gray-50 dark:bg-gray-800">
          <p className="text-azul-oscuro dark:text-azul-claro">
            {obtenerDatoSeguro(value, `${label} no encontrado`)}
          </p>
        </div>
      )}
    </div>
  )

  return (
    <SidebarLayout userRole="coordinacion" currentUser={currentUser}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900 p-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <div className="neu-card p-8 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                    <Settings className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-azul-oscuro dark:text-azul-claro">Configuración</h1>
                    <p className="text-gray-600 dark:text-gray-400">Gestiona tu perfil y preferencias del sistema</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {!modoEdicion ? (
                    <button
                      onClick={() => setModoEdicion(true)}
                      className="neu-button px-4 py-2 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
                    >
                      <Edit className="w-4 h-4 text-azul-medio" />
                      <span className="font-medium text-azul-oscuro dark:text-azul-claro">Editar Perfil</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={cancelarEdicion}
                        className="neu-button px-4 py-2 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-700">Cancelar</span>
                      </button>
                      <button
                        onClick={guardarCambios}
                        disabled={guardando}
                        className="neu-button-primary px-4 py-2 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
                      >
                        {guardando ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span className="font-medium">
                          {guardando ? 'Guardando...' : 'Guardar'}
                        </span>
                      </button>
                    </div>
                  )}
                  
                  <button
                    onClick={cargarUsuario}
                    disabled={loading}
                    className="neu-button px-4 py-2 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
                  >
                    <RefreshCw className={`w-4 h-4 text-azul-medio ${loading ? 'animate-spin' : ''}`} />
                    <span className="font-medium text-azul-oscuro dark:text-azul-claro">Actualizar</span>
                  </button>
                </div>
              </div>

              {/* Mensajes de estado */}
              {mensajeExito && (
                <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-green-800 dark:text-green-200">{mensajeExito}</span>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="text-red-800 dark:text-red-200">{error}</span>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="neu-card p-8 animate-pulse dark:bg-gray-800">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-48 mb-6"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-24"></div>
                      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-24"></div>
                      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-center py-8">
                <Loader2 className="w-12 h-12 text-azul-medio animate-spin mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Cargando configuración...</p>
              </div>
            </div>
          ) : error && !usuario ? (
            <div className="neu-card p-12 text-center dark:bg-gray-800">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error al cargar configuración</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <button
                onClick={cargarUsuario}
                className="neu-button-primary px-6 py-3 rounded-xl font-semibold"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Información Personal */}
              <div className="neu-card p-8 dark:bg-gray-800">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-azul-oscuro dark:text-azul-claro">Información Personal</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CampoEditable
                    label="Primer Nombre"
                    value={usuario?.primer_nombre}
                    field="primer_nombre"
                    placeholder="Ingresa tu primer nombre"
                    icono={User}
                    required
                  />
                  
                  <CampoEditable
                    label="Segundo Nombre"
                    value={usuario?.segundo_nombre}
                    field="segundo_nombre"
                    placeholder="Ingresa tu segundo nombre"
                    icono={User}
                  />
                  
                  <CampoEditable
                    label="Primer Apellido"
                    value={usuario?.primer_apellido}
                    field="primer_apellido"
                    placeholder="Ingresa tu primer apellido"
                    icono={User}
                    required
                  />
                  
                  <CampoEditable
                    label="Segundo Apellido"
                    value={usuario?.segundo_apellido}
                    field="segundo_apellido"
                    placeholder="Ingresa tu segundo apellido"
                    icono={User}
                  />
                  
                  <CampoEditable
                    label="Email"
                    value={usuario?.email}
                    field="email"
                    type="email"
                    placeholder="correo@universidad.edu.co"
                    icono={Mail}
                    required
                  />
                  
                  <CampoEditable
                    label="Teléfono"
                    value={usuario?.telefono}
                    field="telefono"
                    type="tel"
                    placeholder="3001234567"
                    icono={Phone}
                    required
                  />
                </div>
              </div>

              {/* Información Institucional */}
              <div className="neu-card p-8 dark:bg-gray-800">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Building className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-xl font-bold text-azul-oscuro dark:text-azul-claro">Información Institucional</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-azul-oscuro dark:text-azul-claro">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4" />
                        <span>Rol</span>
                      </div>
                    </label>
                    <div className="neu-card p-3 bg-blue-50 dark:bg-blue-900">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                        {obtenerDatoSeguro(usuario?.rol, 'Rol no encontrado')}
                      </span>
                    </div>
                  </div>
                  
                  <CampoEditable
                    label="Institución"
                    value={usuario?.institucion_origen}
                    field="institucion_origen"
                    placeholder="Universidad"
                    icono={Building}
                  />
                  
                  <CampoEditable
                    label="Facultad"
                    value={usuario?.facultad}
                    field="facultad"
                    placeholder="Facultad de..."
                    icono={Building}
                  />
                  
                  <CampoEditable
                    label="Tipo de Identificación"
                    value={usuario?.tipo_identificacion}
                    field="tipo_identificacion"
                    placeholder="Cédula de Ciudadanía"
                    icono={User}
                  />
                  
                  <CampoEditable
                    label="Número de Identificación"
                    value={usuario?.numero_identificacion}
                    field="numero_identificacion"
                    placeholder="12345678"
                    icono={User}
                  />
                </div>
              </div>

              {/* Ubicación */}
              <div className="neu-card p-8 dark:bg-gray-800">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <MapPin className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h2 className="text-xl font-bold text-azul-oscuro dark:text-azul-claro">Ubicación</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CampoEditable
                    label="Dirección"
                    value={usuario?.direccion}
                    field="direccion"
                    placeholder="Calle 123 #45-67"
                    icono={MapPin}
                  />
                  
                  <CampoEditable
                    label="País"
                    value={usuario?.pais}
                    field="pais"
                    placeholder="Colombia"
                    icono={MapPin}
                  />
                  
                  <CampoEditable
                    label="Departamento"
                    value={usuario?.departamento}
                    field="departamento"
                    placeholder="Cauca"
                    icono={MapPin}
                  />
                  
                  <CampoEditable
                    label="Municipio"
                    value={usuario?.municipio}
                    field="municipio"
                    placeholder="Popayán"
                    icono={MapPin}
                  />
                </div>
              </div>

              {/* Seguridad */}
              {modoEdicion && (
                <div className="neu-card p-8 dark:bg-gray-800">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                      <Lock className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-xl font-bold text-azul-oscuro dark:text-azul-claro">Cambiar Contraseña</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-azul-oscuro dark:text-azul-claro">
                        <div className="flex items-center space-x-2">
                          <Lock className="w-4 h-4" />
                          <span>Contraseña Actual</span>
                        </div>
                      </label>
                      <div className="relative">
                        <input
                          type={mostrarPassword ? 'text' : 'password'}
                          value={passwordActual}
                          onChange={(e) => setPasswordActual(e.target.value)}
                          placeholder="Contraseña actual"
                          className="w-full neu-input pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setMostrarPassword(!mostrarPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          {mostrarPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div></div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-azul-oscuro dark:text-azul-claro">
                        <div className="flex items-center space-x-2">
                          <Lock className="w-4 h-4" />
                          <span>Nueva Contraseña</span>
                        </div>
                      </label>
                      <input
                        type="password"
                        value={nuevaPassword}
                        onChange={(e) => setNuevaPassword(e.target.value)}
                        placeholder="Nueva contraseña"
                        className={`w-full neu-input ${
                          erroresValidacion.password ? 'border-red-500 ring-red-200' : ''
                        }`}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-azul-oscuro dark:text-azul-claro">
                        <div className="flex items-center space-x-2">
                          <Lock className="w-4 h-4" />
                          <span>Confirmar Contraseña</span>
                        </div>
                      </label>
                      <input
                        type="password"
                        value={confirmarPassword}
                        onChange={(e) => setConfirmarPassword(e.target.value)}
                        placeholder="Confirmar nueva contraseña"
                        className={`w-full neu-input ${
                          erroresValidacion.password ? 'border-red-500 ring-red-200' : ''
                        }`}
                      />
                      {erroresValidacion.password && (
                        <p className="text-red-500 text-xs mt-1">{erroresValidacion.password}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Preferencias del Sistema */}
              <div className="neu-card p-8 dark:bg-gray-800">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-xl font-bold text-azul-oscuro dark:text-azul-claro">Preferencias del Sistema</h2>
                </div>
                
                {/* Modo Oscuro */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-azul-oscuro dark:text-azul-claro mb-4">Apariencia</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => aplicarModoOscuro('light')}
                      className={`neu-card p-4 flex flex-col items-center space-y-2 transition-all duration-300 ${
                        modoOscuro === 'light' ? 'ring-2 ring-azul-medio bg-blue-50 dark:bg-blue-900' : ''
                      }`}
                    >
                      <Sun className="w-8 h-8 text-yellow-500" />
                      <span className="font-medium text-azul-oscuro dark:text-azul-claro">Claro</span>
                    </button>
                    
                    <button
                      onClick={() => aplicarModoOscuro('dark')}
                      className={`neu-card p-4 flex flex-col items-center space-y-2 transition-all duration-300 ${
                        modoOscuro === 'dark' ? 'ring-2 ring-azul-medio bg-blue-50 dark:bg-blue-900' : ''
                      }`}
                    >
                      <Moon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium text-azul-oscuro dark:text-azul-claro">Oscuro</span>
                    </button>
                    
                    <button
                      onClick={() => aplicarModoOscuro('system')}
                      className={`neu-card p-4 flex flex-col items-center space-y-2 transition-all duration-300 ${
                        modoOscuro === 'system' ? 'ring-2 ring-azul-medio bg-blue-50 dark:bg-blue-900' : ''
                      }`}
                    >
                      <Monitor className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                      <span className="font-medium text-azul-oscuro dark:text-azul-claro">Sistema</span>
                    </button>
                  </div>
                </div>

                {/* Notificaciones */}
                <div>
                  <h3 className="text-lg font-semibold text-azul-oscuro dark:text-azul-claro mb-4">Notificaciones</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 neu-card">
                      <div className="flex items-center space-x-3">
                        <Bell className="w-5 h-5 text-azul-medio" />
                        <div>
                          <p className="font-medium text-azul-oscuro dark:text-azul-claro">Notificaciones por Email</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Recibir notificaciones en tu correo electrónico</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificaciones.email}
                          onChange={(e) => setNotificaciones({...notificaciones, email: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 neu-card">
                      <div className="flex items-center space-x-3">
                        <Bell className="w-5 h-5 text-azul-medio" />
                        <div>
                          <p className="font-medium text-azul-oscuro dark:text-azul-claro">Nuevas Solicitudes</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Notificar cuando lleguen nuevas solicitudes</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificaciones.solicitudesNuevas}
                          onChange={(e) => setNotificaciones({...notificaciones, solicitudesNuevas: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 neu-card">
                      <div className="flex items-center space-x-3">
                        <Bell className="w-5 h-5 text-azul-medio" />
                        <div>
                          <p className="font-medium text-azul-oscuro dark:text-azul-claro">Recordatorios</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Recordatorios de tareas pendientes</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificaciones.recordatorios}
                          onChange={(e) => setNotificaciones({...notificaciones, recordatorios: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información de la Cuenta */}
              <div className="neu-card p-8 dark:bg-gray-800">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                    <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h2 className="text-xl font-bold text-azul-oscuro dark:text-azul-claro">Información de la Cuenta</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-azul-oscuro dark:text-azul-claro">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>ID de Usuario</span>
                      </div>
                    </label>
                    <div className="neu-card p-3 bg-gray-50 dark:bg-gray-700">
                      <p className="text-azul-oscuro dark:text-azul-claro font-mono">
                        #{obtenerDatoSeguro(usuario?.id_usuario, 'ID no encontrado')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-azul-oscuro dark:text-azul-claro">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4" />
                        <span>Estado de la Cuenta</span>
                      </div>
                    </label>
                    <div className="neu-card p-3 bg-gray-50 dark:bg-gray-700">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        usuario?.activo 
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      }`}>
                        {usuario?.activo ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-azul-oscuro dark:text-azul-claro">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Fecha de Creación</span>
                      </div>
                    </label>
                    <div className="neu-card p-3 bg-gray-50 dark:bg-gray-700">
                      <p className="text-azul-oscuro dark:text-azul-claro">
                        {formatearFecha(usuario?.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-azul-oscuro dark:text-azul-claro">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Última Actualización</span>
                      </div>
                    </label>
                    <div className="neu-card p-3 bg-gray-50 dark:bg-gray-700">
                      <p className="text-azul-oscuro dark:text-azul-claro">
                        {formatearFecha(usuario?.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones Adicionales */}
              <div className="neu-card p-8 dark:bg-gray-800">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <h2 className="text-xl font-bold text-azul-oscuro dark:text-azul-claro">Acciones Adicionales</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="neu-button p-4 rounded-xl flex flex-col items-center space-y-2 hover:shadow-lg transition-all duration-300">
                    <Camera className="w-6 h-6 text-azul-medio" />
                    <span className="font-medium text-azul-oscuro dark:text-azul-claro">Exportar Datos</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Descargar información personal</span>
                  </button>
                  
                  <button className="neu-button p-4 rounded-xl flex flex-col items-center space-y-2 hover:shadow-lg transition-all duration-300">
                    <Shield className="w-6 h-6 text-green-600" />
                    <span className="font-medium text-azul-oscuro dark:text-azul-claro">Seguridad</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Configurar 2FA</span>
                  </button>
                  
                  <button className="neu-button p-4 rounded-xl flex flex-col items-center space-y-2 hover:shadow-lg transition-all duration-300 text-red-600">
                    <AlertCircle className="w-6 h-6" />
                    <span className="font-medium">Cerrar Sesión</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Salir del sistema</span>
                  </button>
                </div>
              </div>

              {/* Estado sin datos */}
              {!usuario && !loading && !error && (
                <div className="neu-card p-12 text-center dark:bg-gray-800">
                  <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No se encontraron datos</h3>
                  <p className="text-gray-500 dark:text-gray-500 mb-4">
                    No se pudo cargar la información del usuario
                  </p>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>ID de usuario: No encontrado</p>
                    <p>Nombre: No encontrado</p>
                    <p>Email: No encontrado</p>
                    <p>Rol: No encontrado</p>
                    <p>Estado: No encontrado</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  )
}