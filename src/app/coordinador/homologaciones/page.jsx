'use client'

import SidebarLayout from '../../../layouts/SidebarLayout'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FileText, 
  Filter,
  Search,
  Eye,
  FolderOpen,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertTriangle
} from 'lucide-react'

export default function HomologacionesVista() {
  const router = useRouter()
  
  // Estados para datos de la API
  const [solicitudes, setSolicitudes] = useState([])
  const [solicitudesFiltradas, setSolicitudesFiltradas] = useState([])
  
  // Estados de carga y errores
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(true)
  const [error, setError] = useState(null)
  
  // Estados de filtros
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [ordenamiento, setOrdenamiento] = useState('fecha_desc')

  // Estados disponibles basados en los datos de la API
  const estadosDisponibles = [
    { id: 'todos', label: 'Todas las Solicitudes', color: 'gray', count: 0 },
    { id: 'Radicado', label: 'Radicadas', color: 'blue', count: 0 },
    { id: 'En revisión', label: 'En Revisión', color: 'yellow', count: 0 },
    { id: 'Aprobado', label: 'Aprobadas', color: 'green', count: 0 },
    { id: 'Rechazado', label: 'Rechazadas', color: 'red', count: 0 }
  ]

  // Función para cargar datos de la API
  const cargarSolicitudes = async () => {
    try {
      setLoadingSolicitudes(true)
      setError(null)
      
      const response = await fetch('http://127.0.0.1:8000/api/solicitudes')
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Validar que data sea un array
      if (!Array.isArray(data)) {
        throw new Error('Los datos recibidos no tienen el formato esperado')
      }
      
      setSolicitudes(data)
      console.log('Solicitudes cargadas:', data.length)
      
    } catch (error) {
      console.error('Error al cargar solicitudes:', error)
      setError(error.message)
      setSolicitudes([])
    } finally {
      setLoadingSolicitudes(false)
    }
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarSolicitudes()
  }, [])

  // Obtener datos seguros con fallbacks
  const obtenerDatoSeguro = (valor, fallback) => {
    return valor && valor.toString().trim() !== '' ? valor : fallback
  }

  // Formatear fecha
  const formatearFecha = (fechaString) => {
    if (!fechaString) return 'Fecha no encontrada'
    try {
      const fecha = new Date(fechaString)
      return fecha.toLocaleDateString('es-ES', {
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

  // Obtener nombre completo
  const obtenerNombreCompleto = (solicitud) => {
    if (!solicitud) return 'Estudiante no encontrado'
    
    const primerNombre = solicitud.primer_nombre || ''
    const segundoNombre = solicitud.segundo_nombre || ''
    const primerApellido = solicitud.primer_apellido || ''
    const segundoApellido = solicitud.segundo_apellido || ''
    
    const nombreCompleto = `${primerNombre} ${segundoNombre} ${primerApellido} ${segundoApellido}`.trim()
    return nombreCompleto || 'Nombre no encontrado'
  }

  // Obtener color del estado
  const obtenerColorEstado = (estado) => {
    switch(estado) {
      case 'Radicado': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'En revisión': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Aprobado': return 'bg-green-100 text-green-800 border-green-200'
      case 'Rechazado': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Obtener icono del estado
  const obtenerIconoEstado = (estado) => {
    switch(estado) {
      case 'Radicado': return <Clock className="w-4 h-4" />
      case 'En revisión': return <AlertCircle className="w-4 h-4" />
      case 'Aprobado': return <CheckCircle className="w-4 h-4" />
      case 'Rechazado': return <XCircle className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  // Función de actualización
  const actualizarDatos = () => {
    cargarSolicitudes()
  }

  // Filtrar y ordenar solicitudes
  useEffect(() => {
    let resultado = [...solicitudes]

    // Filtro por estado
    if (filtroEstado !== 'todos') {
      resultado = resultado.filter(s => s.estado === filtroEstado)
    }

    // Filtro por búsqueda
    if (busqueda.trim()) {
      const terminoBusqueda = busqueda.toLowerCase()
      resultado = resultado.filter(s => 
        obtenerNombreCompleto(s).toLowerCase().includes(terminoBusqueda) ||
        (s.numero_radicado || '').toLowerCase().includes(terminoBusqueda) ||
        (s.email || '').toLowerCase().includes(terminoBusqueda) ||
        (s.institucion_origen_nombre || '').toLowerCase().includes(terminoBusqueda) ||
        (s.numero_identificacion || '').toLowerCase().includes(terminoBusqueda)
      )
    }

    // Ordenamiento con prioridad para radicadas
    resultado.sort((a, b) => {
      // Prioridad 1: Radicadas primero
      if (a.estado === 'Radicado' && b.estado !== 'Radicado') return -1
      if (b.estado === 'Radicado' && a.estado !== 'Radicado') return 1
      
      // Prioridad 2: Entre radicadas, las más antiguas primero
      if (a.estado === 'Radicado' && b.estado === 'Radicado') {
        return new Date(a.fecha_solicitud) - new Date(b.fecha_solicitud)
      }
      
      // Para el resto, aplicar ordenamiento seleccionado
      switch(ordenamiento) {
        case 'fecha_asc':
          return new Date(a.fecha_solicitud) - new Date(b.fecha_solicitud)
        case 'fecha_desc':
          return new Date(b.fecha_solicitud) - new Date(a.fecha_solicitud)
        case 'nombre_asc':
          return obtenerNombreCompleto(a).localeCompare(obtenerNombreCompleto(b))
        case 'nombre_desc':
          return obtenerNombreCompleto(b).localeCompare(obtenerNombreCompleto(a))
        default:
          return new Date(b.fecha_solicitud) - new Date(a.fecha_solicitud)
      }
    })

    setSolicitudesFiltradas(resultado)
  }, [solicitudes, filtroEstado, busqueda, ordenamiento])

  // Calcular contadores de estados
  const calcularContadores = () => {
    return estadosDisponibles.map(estado => ({
      ...estado,
      count: estado.id === 'todos' 
        ? solicitudes.length 
        : solicitudes.filter(s => s.estado === estado.id).length
    }))
  }

  // Configurar usuario para sidebar (datos mock ya que no hay API de usuario)
  const currentUser = {
    name: 'Coordinador',
    email: 'coordinador@unicauca.edu.co'
  }

  // Navegación a subvistas usando el id de la solicitud
  const navegarAInfo = (solicitud) => {
    console.log('Navegando a información de solicitud:', solicitud.id_solicitud)
    router.push(`/coordinador/homologaciones/${solicitud.id_solicitud}/ver-informacion`)
  }

  const navegarADocumentos = (solicitud) => {
    console.log('Navegando a documentos de solicitud:', solicitud.id_solicitud)
    router.push(`/coordinador/homologaciones/${solicitud.id_solicitud}/ver-documentos`)
  }

  const navegarAProceso = (solicitud) => {
    console.log('Navegando a proceso de solicitud:', solicitud.id_solicitud)
    router.push(`/coordinador/homologaciones/${solicitud.id_solicitud}/gestionar-proceso`)
  }

  // Componente de tarjeta de solicitud
  const TarjetaSolicitud = ({ solicitud }) => (
    <div className="neu-card p-6 hover:shadow-lg transition-all duration-300">
      {/* Header de la tarjeta */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-bold text-blue-900">
              {obtenerNombreCompleto(solicitud)}
            </h3>
            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${obtenerColorEstado(solicitud.estado || 'Sin estado')}`}>
              {obtenerIconoEstado(solicitud.estado)}
              <span>{obtenerDatoSeguro(solicitud.estado, 'Estado no encontrado')}</span>
            </span>
          </div>
          <p className="text-blue-600 font-medium text-sm">
            #{obtenerDatoSeguro(solicitud.numero_radicado, 'Radicado no encontrado')}
          </p>
        </div>
        {solicitud.estado === 'Radicado' && (
          <div className="bg-red-100 text-red-800 px-2 py-1 rounded-lg text-xs font-medium">
            Prioridad Alta
          </div>
        )}
      </div>

      {/* Información del estudiante */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{obtenerDatoSeguro(solicitud.email, 'Email no encontrado')}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{obtenerDatoSeguro(solicitud.telefono, 'Teléfono no disponible')}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              {obtenerDatoSeguro(solicitud.tipo_identificacion, 'CC')} - {obtenerDatoSeguro(solicitud.numero_identificacion, 'ID no encontrada')}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <GraduationCap className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{obtenerDatoSeguro(solicitud.institucion_origen_nombre, 'Institución no encontrada')}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{formatearFecha(solicitud.fecha_solicitud)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              {solicitud.municipio_nombre && solicitud.departamento_nombre 
                ? `${solicitud.municipio_nombre}, ${solicitud.departamento_nombre}` 
                : obtenerDatoSeguro(solicitud.pais_nombre, 'Ubicación no encontrada')
              }
            </span>
          </div>
        </div>
      </div>

      {/* Programa destino */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4">
        <p className="text-sm text-gray-600 mb-1">Programa de destino:</p>
        <p className="font-medium text-blue-900">{obtenerDatoSeguro(solicitud.programa_destino_nombre, 'Programa no encontrado')}</p>
      </div>

      {/* Estado de estudios */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-sm text-gray-600 mb-1">Estado de estudios:</p>
        <p className="font-medium text-gray-700">
          {solicitud.finalizo_estudios === 'Si' 
            ? `Finalizó el ${formatearFecha(solicitud.fecha_finalizacion_estudios)}`
            : `Último semestre: ${formatearFecha(solicitud.fecha_ultimo_semestre_cursado)}`
          }
        </p>
      </div>

      {/* Botones de acción */}
      <div className="flex space-x-3">
        <button
          onClick={() => navegarAInfo(solicitud)}
          className="flex-1 neu-button px-4 py-3 rounded-xl flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-300"
        >
          <Eye className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-blue-900">Info</span>
        </button>
        
        <button
          onClick={() => navegarADocumentos(solicitud)}
          className="flex-1 neu-button px-4 py-3 rounded-xl flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-300"
        >
          <FolderOpen className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-blue-900">Documentos</span>
        </button>
        
        <button
          onClick={() => navegarAProceso(solicitud)}
          className="flex-1 neu-button-primary px-4 py-3 rounded-xl flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-300"
        >
          <Settings className="w-4 h-4 text-white" />
          <span className="font-medium text-white">Proceso</span>
        </button>
      </div>
    </div>
  )

  return (
    <SidebarLayout userRole="coordinacion" currentUser={currentUser}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <div className="neu-card p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-blue-900">Gestión de Homologaciones</h1>
                    <p className="text-gray-600">Administra todas las solicitudes del sistema</p>
                  </div>
                </div>
                <button
                  onClick={actualizarDatos}
                  className="neu-button px-4 py-2 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
                  disabled={loadingSolicitudes}
                >
                  <RefreshCw className={`w-4 h-4 text-blue-600 ${loadingSolicitudes ? 'animate-spin' : ''}`} />
                  <span className="font-medium text-blue-900">Actualizar</span>
                </button>
              </div>

              {/* Mostrar error si existe */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="text-red-800 font-medium">Error al cargar las solicitudes</p>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                  <button
                    onClick={actualizarDatos}
                    className="ml-auto px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200 transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              )}

              {/* Contadores por estado */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {calcularContadores().map((estado) => (
                  <div
                    key={estado.id}
                    onClick={() => setFiltroEstado(estado.id)}
                    className={`neu-card p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      filtroEstado === estado.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                  >
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-900">{estado.count}</p>
                      <p className="text-sm text-gray-600">{estado.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filtros y búsqueda */}
          <div className="mb-6">
            <div className="neu-card p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Búsqueda */}
                <div className="flex-1 lg:max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre, radicado, email, cédula..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 neu-card rounded-xl border-0 focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                {/* Filtros avanzados */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setMostrarFiltros(!mostrarFiltros)}
                    className="neu-button px-4 py-3 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
                  >
                    <Filter className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Filtros</span>
                    {mostrarFiltros ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <select
                    value={ordenamiento}
                    onChange={(e) => setOrdenamiento(e.target.value)}
                    className="neu-card px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 text-sm font-medium text-blue-900"
                  >
                    <option value="fecha_desc">Más recientes</option>
                    <option value="fecha_asc">Más antiguos</option>
                    <option value="nombre_asc">Nombre A-Z</option>
                    <option value="nombre_desc">Nombre Z-A</option>
                  </select>
                </div>
              </div>

              {/* Filtros expandidos */}
              {mostrarFiltros && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                      <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                        className="w-full neu-card px-3 py-2 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        {estadosDisponibles.map(estado => (
                          <option key={estado.id} value={estado.id}>{estado.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lista de solicitudes */}
          <div className="space-y-6">
            {loadingSolicitudes ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="neu-card p-6 animate-pulse">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded-md w-64 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded-md w-32"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded-md w-24"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                        <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                        <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-16 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-16 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="flex space-x-3">
                      <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
                      <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
                      <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
                    </div>
                  </div>
                ))}
                <div className="text-center py-8">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Cargando solicitudes desde la API...</p>
                </div>
              </div>
            ) : error ? (
              <div className="neu-card p-12 text-center">
                <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-600 mb-2">
                  Error al cargar las solicitudes
                </h3>
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={actualizarDatos}
                  className="neu-button-primary px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reintentar
                </button>
              </div>
            ) : solicitudesFiltradas.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-600">
                    Mostrando {solicitudesFiltradas.length} de {solicitudes.length} solicitudes
                  </p>
                  {filtroEstado === 'Radicado' && (
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium">
                      Ordenadas por prioridad: Más antiguas primero
                    </div>
                  )}
                </div>
                
                {solicitudesFiltradas.map((solicitud) => (
                  <TarjetaSolicitud 
                    key={solicitud.id_solicitud} 
                    solicitud={solicitud}
                  />
                ))}
              </>
            ) : (
              <div className="neu-card p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No se encontraron solicitudes
                </h3>
                <p className="text-gray-500 mb-4">
                  {busqueda || filtroEstado !== 'todos' 
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Aún no hay solicitudes de homologación en el sistema'
                  }
                </p>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>Solicitudes cargadas: {solicitudes.length}</p>
                  <p>Filtro activo: {estadosDisponibles.find(e => e.id === filtroEstado)?.label || 'Desconocido'}</p>
                  <p>Término de búsqueda: {busqueda || 'Ninguno'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}