'use client'

import SidebarLayout from '../../layouts/SidebarLayout'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FileText, 
  BarChart3, 
  Settings, 
  Building, 
  Calendar,
  Users,
  Clock,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'

export default function CoordinadorDashboard() {
  const router = useRouter()
  
  // Estados para datos
  const [coordinador, setCoordinador] = useState(null)
  const [solicitudesRadicadas, setSolicitudesRadicadas] = useState([])
  const [solicitudesRecientes, setSolicitudesRecientes] = useState([])
  const [totalRadicadas, setTotalRadicadas] = useState(0)
  
  // Estados de carga y errores
  const [loadingCoordinador, setLoadingCoordinador] = useState(true)
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(true)
  const [errorCoordinador, setErrorCoordinador] = useState(null)
  const [errorSolicitudes, setErrorSolicitudes] = useState(null)

  // Obtener fecha actual formateada
  const getFechaActual = () => {
    const hoy = new Date()
    const opciones = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    return hoy.toLocaleDateString('es-ES', opciones)
  }

  // Formatear fecha de solicitud
  const formatearFecha = (fechaString) => {
    if (!fechaString) return 'Fecha no encontrada'
    try {
      const fecha = new Date(fechaString)
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch {
      return 'Fecha inválida'
    }
  }

  // Obtener nombre completo del estudiante
  const obtenerNombreCompleto = (solicitud) => {
    if (!solicitud) return 'Estudiante no encontrado'
    
    const primerNombre = solicitud.primer_nombre || ''
    const segundoNombre = solicitud.segundo_nombre || ''
    const primerApellido = solicitud.primer_apellido || ''
    const segundoApellido = solicitud.segundo_apellido || ''
    
    const nombreCompleto = `${primerNombre} ${segundoNombre} ${primerApellido} ${segundoApellido}`.trim()
    return nombreCompleto || 'Nombre no encontrado'
  }

  // Obtener datos seguros con fallbacks
  const obtenerDatoSeguro = (valor, fallback) => {
    return valor && valor.toString().trim() !== '' ? valor : fallback
  }

  // Cargar datos del coordinador
  const cargarCoordinador = async () => {
    try {
      setLoadingCoordinador(true)
      setErrorCoordinador(null)
      
      const response = await fetch('http://127.0.0.1:8000/api/usuarios')
      if (!response.ok) {
        throw new Error('Error al cargar datos del coordinador')
      }
      
      const usuarios = await response.json()
      const coordinadorData = usuarios.find(user => user.rol === 'Coordinador')
      
      if (!coordinadorData) {
        throw new Error('No se encontró un coordinador activo')
      }
      
      setCoordinador(coordinadorData)
    } catch (error) {
      console.error('Error cargando coordinador:', error)
      setErrorCoordinador(error.message)
    } finally {
      setLoadingCoordinador(false)
    }
  }

  // Cargar solicitudes radicadas
  const cargarSolicitudes = async () => {
    try {
      setLoadingSolicitudes(true)
      setErrorSolicitudes(null)
      
      const response = await fetch('http://127.0.0.1:8000/api/solicitudes')
      if (!response.ok) {
        throw new Error('Error al cargar solicitudes')
      }
      
      const solicitudes = await response.json()
      
      // Filtrar solo las solicitudes radicadas
      const radicadas = solicitudes.filter(s => s.estado === 'Radicado')
      
      // Ordenar por fecha más reciente primero
      const ordenadas = radicadas.sort((a, b) => 
        new Date(b.fecha_solicitud) - new Date(a.fecha_solicitud)
      )
      
      setSolicitudesRadicadas(radicadas)
      setSolicitudesRecientes(ordenadas.slice(0, 5))
      setTotalRadicadas(radicadas.length)
      
    } catch (error) {
      console.error('Error cargando solicitudes:', error)
      setErrorSolicitudes(error.message)
    } finally {
      setLoadingSolicitudes(false)
    }
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarCoordinador()
    cargarSolicitudes()
  }, [])

  // Configurar usuario actual para el SidebarLayout
  const currentUser = {
    name: coordinador ? 
      `${obtenerDatoSeguro(coordinador.primer_nombre, 'Nombre')} ${obtenerDatoSeguro(coordinador.primer_apellido, 'Apellido')}` :
      'Usuario no encontrado',
    email: coordinador ? 
      obtenerDatoSeguro(coordinador.email, 'Email no encontrado') :
      'Email no encontrado'
  }

  // Componente de tarjeta estadística
  const TarjetaEstadistica = ({ titulo, valor, icono: IconComponent, color = "azul-medio" }) => (
    <div className="neu-card p-6 text-center">
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 mx-auto mb-3 flex items-center justify-center`}>
        <IconComponent className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-blue-900 mb-1">
        {valor !== null && valor !== undefined ? valor : 'N/D'}
      </h3>
      <p className="text-gray-600 text-sm">{titulo}</p>
    </div>
  )

  // Componente de fila de solicitud
  const FilaSolicitud = ({ solicitud }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-gray-200 last:border-b-0">
      <div>
        <p className="font-semibold text-blue-900">
          {obtenerNombreCompleto(solicitud)}
        </p>
        <p className="text-sm text-gray-600">
          {obtenerDatoSeguro(solicitud?.email, 'Email no encontrado')}
        </p>
      </div>
      <div>
        <p className="text-blue-600 font-medium">
          {obtenerDatoSeguro(solicitud?.institucion_origen_nombre, 'Institución no encontrada')}
        </p>
        <p className="text-sm text-gray-600">
          {obtenerDatoSeguro(solicitud?.programa_destino_nombre, 'Programa no encontrado')}
        </p>
      </div>
      <div className="text-right md:text-left">
        <p className="font-medium text-blue-900">
          {formatearFecha(solicitud?.fecha_solicitud)}
        </p>
        <p className="text-sm text-green-600">
          #{obtenerDatoSeguro(solicitud?.numero_radicado, 'Radicado no encontrado')}
        </p>
      </div>
    </div>
  )

  return (
    <SidebarLayout userRole="coordinacion" currentUser={currentUser}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header del Dashboard */}
          <div className="mb-8">
            <div className="neu-card p-8">
              {loadingCoordinador ? (
                <div className="flex items-center space-x-4">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  <div>
                    <div className="h-6 bg-gray-200 rounded-md w-64 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-48 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-32 mt-2 animate-pulse"></div>
                  </div>
                </div>
              ) : errorCoordinador ? (
                <div className="flex items-center space-x-4 text-red-600">
                  <AlertCircle className="w-8 h-8" />
                  <div>
                    <h2 className="text-xl font-bold">Error al cargar datos del coordinador</h2>
                    <p className="text-sm">{errorCoordinador}</p>
                    <p className="text-sm mt-1">Nombre: Coordinador no encontrado</p>
                    <p className="text-sm">Email: Email no encontrado</p>
                  </div>
                </div>
              ) : coordinador ? (
                <div>
                  <h1 className="text-3xl font-bold text-blue-900 mb-2">
                    ¡Hola, {obtenerDatoSeguro(coordinador.primer_nombre, 'Nombre no encontrado')} {obtenerDatoSeguro(coordinador.primer_apellido, 'Apellido no encontrado')}! 👋
                  </h1>
                  <p className="text-blue-600 text-lg mb-2">
                    {obtenerDatoSeguro(coordinador.rol, 'Rol no encontrado')} de Homologaciones
                  </p>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>Hoy es {getFechaActual()}</span>
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Email: {obtenerDatoSeguro(coordinador.email, 'Email no encontrado')}</p>
                    <p>Teléfono: {obtenerDatoSeguro(coordinador.telefono, 'Teléfono no encontrado')}</p>
                    <p>Institución: {obtenerDatoSeguro(coordinador.institucion_origen, 'Institución no encontrada')}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No se encontraron datos del coordinador</p>
                  <div className="text-sm text-gray-500 mt-4 space-y-1">
                    <p>Nombre: Coordinador no encontrado</p>
                    <p>Email: Email no encontrado</p>
                    <p>Rol: Rol no encontrado</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resumen de Solicitudes Radicadas */}
          <div className="mb-8">
            <div className="neu-card p-8">
              <div className="flex items-center mb-6">
                <FileText className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-blue-900">Resumen de Solicitudes Radicadas</h2>
              </div>
              
              {loadingSolicitudes ? (
                <div className="text-center py-8">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Cargando solicitudes...</p>
                  <div className="text-sm text-gray-500 mt-4">
                    <p>Total de solicitudes: Cargando...</p>
                    <p>Solicitudes de esta semana: Cargando...</p>
                    <p>Solicitudes de hoy: Cargando...</p>
                  </div>
                </div>
              ) : errorSolicitudes ? (
                <div className="text-center py-8 text-red-600">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Error al cargar solicitudes</h3>
                  <p className="text-sm">{errorSolicitudes}</p>
                  <div className="text-sm text-gray-500 mt-4 space-y-1">
                    <p>Total de solicitudes: No se pudo cargar</p>
                    <p>Solicitudes de esta semana: No se pudo cargar</p>
                    <p>Solicitudes de hoy: No se pudo cargar</p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <div className="flex items-center text-blue-600 mb-4">
                      <Users className="w-6 h-6 mr-2" />
                      <span className="text-lg font-semibold">
                        {totalRadicadas || 0} solicitudes pendientes de revisión
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TarjetaEstadistica 
                      titulo="Total Radicadas" 
                      valor={totalRadicadas || 0} 
                      icono={FileText}
                      color="blue-600"
                    />
                    <TarjetaEstadistica 
                      titulo="Esta Semana" 
                      valor={solicitudesRadicadas ? solicitudesRadicadas.filter(s => {
                        if (!s.fecha_solicitud) return false
                        try {
                          const fechaSolicitud = new Date(s.fecha_solicitud)
                          const hoy = new Date()
                          const inicioSemana = new Date(hoy.setDate(hoy.getDate() - hoy.getDay()))
                          return fechaSolicitud >= inicioSemana
                        } catch {
                          return false
                        }
                      }).length : 0} 
                      icono={TrendingUp}
                      color="green-600"
                    />
                    <TarjetaEstadistica 
                      titulo="Hoy" 
                      valor={solicitudesRadicadas ? solicitudesRadicadas.filter(s => {
                        if (!s.fecha_solicitud) return false
                        try {
                          const fechaSolicitud = new Date(s.fecha_solicitud).toDateString()
                          const hoy = new Date().toDateString()
                          return fechaSolicitud === hoy
                        } catch {
                          return false
                        }
                      }).length : 0} 
                      icono={Clock}
                      color="yellow-600"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Últimas Solicitudes Radicadas */}
          <div className="mb-8">
            <div className="neu-card p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-blue-900">Últimas Solicitudes Radicadas</h2>
                </div>
              </div>
              
              {loadingSolicitudes ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded-md w-1/2"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded-md w-2/3"></div>
                          <div className="h-3 bg-gray-200 rounded-md w-3/4"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                          <div className="h-3 bg-gray-200 rounded-md w-1/3"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center text-sm text-gray-500 mt-4">
                    <p>Estudiantes: Cargando nombres...</p>
                    <p>Instituciones: Cargando universidades...</p>
                    <p>Fechas: Cargando fechas de radicado...</p>
                  </div>
                </div>
              ) : errorSolicitudes ? (
                <div className="text-center py-8 text-red-600">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No se pudieron cargar las solicitudes</h3>
                  <p className="text-sm">{errorSolicitudes}</p>
                  <div className="text-sm text-gray-500 mt-4 space-y-1">
                    <p>Estudiantes: No se pudieron cargar</p>
                    <p>Instituciones: No se pudieron cargar</p>
                    <p>Fechas: No se pudieron cargar</p>
                    <p>Números de radicado: No se pudieron cargar</p>
                  </div>
                </div>
              ) : solicitudesRecientes.length > 0 ? (
                <div>
                  <div className="hidden md:grid md:grid-cols-3 gap-4 pb-4 mb-4 border-b-2 border-blue-200 font-semibold text-blue-900">
                    <div>Estudiante</div>
                    <div>Universidad de Origen</div>
                    <div>Fecha Radicado</div>
                  </div>
                  
                  <div className="space-y-2">
                    {solicitudesRecientes.map((solicitud) => (
                      <FilaSolicitud 
                        key={solicitud?.id_solicitud || Math.random()} 
                        solicitud={solicitud}
                      />
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <button 
                      onClick={() => router.push('/coordinador/homologaciones')}
                      className="neu-button-primary px-6 py-3 rounded-xl font-semibold text-white flex items-center mx-auto hover:shadow-lg transition-all duration-300"
                    >
                      Ver todas las homologaciones
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">
                    ¡Excelente trabajo!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    No hay solicitudes radicadas pendientes en este momento.
                  </p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Estudiantes pendientes: 0 encontrados</p>
                    <p>Solicitudes en cola: 0 encontradas</p>
                    <p>Documentos por revisar: 0 encontrados</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="neu-card p-8">
            <div className="flex items-center mb-6">
              <Settings className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-blue-900">Acciones Rápidas</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={() => router.push('/coordinador/homologaciones')}
                className="neu-button p-6 rounded-xl flex flex-col items-center space-y-3 hover:shadow-lg transition-all duration-300"
              >
                <FileText className="w-8 h-8 text-blue-600" />
                <span className="font-semibold text-blue-900">Gestionar Solicitudes</span>
              </button>
              
              <button 
                onClick={() => router.push('/coordinador/estadisticas')}
                className="neu-button p-6 rounded-xl flex flex-col items-center space-y-3 hover:shadow-lg transition-all duration-300"
              >
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <span className="font-semibold text-blue-900">Ver Estadísticas</span>
              </button>
              
              <button 
                onClick={() => router.push('/coordinador/instituciones')}
                className="neu-button p-6 rounded-xl flex flex-col items-center space-y-3 hover:shadow-lg transition-all duration-300"
              >
                <Building className="w-8 h-8 text-blue-600" />
                <span className="font-semibold text-blue-900">Instituciones</span>
              </button>
              
              <button 
                onClick={() => router.push('/coordinador/configuracion')}
                className="neu-button p-6 rounded-xl flex flex-col items-center space-y-3 hover:shadow-lg transition-all duration-300"
              >
                <Settings className="w-8 h-8 text-blue-600" />
                <span className="font-semibold text-blue-900">Configuración</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}