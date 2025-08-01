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
  RefreshCw
} from 'lucide-react'

// Datos mock para el coordinador
const mockCoordinador = {
  id: 1,
  primer_nombre: "María",
  segundo_nombre: "Elena",
  primer_apellido: "González",
  segundo_apellido: "Rodríguez",
  email: "maria.gonzalez@unicauca.edu.co",
  telefono: "3001234567",
  rol: "Coordinador",
  institucion_origen: "Universidad del Cauca"
}

// Datos mock para las solicitudes con diferentes estados
const mockSolicitudes = [
  {
    id_solicitud: 1,
    primer_nombre: "Juan",
    segundo_nombre: "Carlos",
    primer_apellido: "Pérez",
    segundo_apellido: "Martínez",
    email: "juan.perez@estudiante.com",
    telefono: "3101234567",
    numero_identificacion: "1005234567",
    institucion_origen_nombre: "Universidad Nacional de Colombia",
    programa_destino_nombre: "Ingeniería de Sistemas",
    fecha_solicitud: "2025-07-15T10:30:00Z",
    numero_radicado: "HR-2025-001",
    estado: "Radicado",
    municipio_nombre: "Bogotá",
    departamento_nombre: "Cundinamarca"
  },
  {
    id_solicitud: 2,
    primer_nombre: "Ana",
    segundo_nombre: "María",
    primer_apellido: "López",
    segundo_apellido: "García",
    email: "ana.lopez@estudiante.com",
    telefono: "3209876543",
    numero_identificacion: "1010567890",
    institucion_origen_nombre: "Universidad de Antioquia",
    programa_destino_nombre: "Administración de Empresas",
    fecha_solicitud: "2025-07-16T14:15:00Z",
    numero_radicado: "HR-2025-002",
    estado: "Radicado",
    municipio_nombre: "Medellín",
    departamento_nombre: "Antioquia"
  },
  {
    id_solicitud: 3,
    primer_nombre: "Carlos",
    segundo_nombre: "Andrés",
    primer_apellido: "Ramírez",
    segundo_apellido: "Torres",
    email: "carlos.ramirez@estudiante.com",
    telefono: "3159876543",
    numero_identificacion: "1006789012",
    institucion_origen_nombre: "Universidad del Valle",
    programa_destino_nombre: "Psicología",
    fecha_solicitud: "2025-07-18T09:45:00Z",
    numero_radicado: "HR-2025-003",
    estado: "En Revision",
    municipio_nombre: "Cali",
    departamento_nombre: "Valle del Cauca"
  },
  {
    id_solicitud: 4,
    primer_nombre: "Laura",
    segundo_nombre: "Sofía",
    primer_apellido: "Herrera",
    segundo_apellido: "Morales",
    email: "laura.herrera@estudiante.com",
    telefono: "3008765432",
    numero_identificacion: "1007890123",
    institucion_origen_nombre: "Pontificia Universidad Javeriana",
    programa_destino_nombre: "Derecho",
    fecha_solicitud: "2025-07-10T16:20:00Z",
    numero_radicado: "HR-2025-004",
    estado: "Aprobada",
    municipio_nombre: "Bogotá",
    departamento_nombre: "Cundinamarca"
  },
  {
    id_solicitud: 5,
    primer_nombre: "Diego",
    segundo_nombre: "Alejandro",
    primer_apellido: "Vargas",
    segundo_apellido: "Quintero",
    email: "diego.vargas@estudiante.com",
    telefono: "3121234567",
    numero_identificacion: "1008901234",
    institucion_origen_nombre: "Universidad de los Andes",
    programa_destino_nombre: "Ingeniería Industrial",
    fecha_solicitud: "2025-07-24T08:00:00Z",
    numero_radicado: "HR-2025-005",
    estado: "Radicado",
    municipio_nombre: "Bogotá",
    departamento_nombre: "Cundinamarca"
  },
  {
    id_solicitud: 6,
    primer_nombre: "Valentina",
    segundo_nombre: "Isabel",
    primer_apellido: "Castro",
    segundo_apellido: "Mendoza",
    email: "valentina.castro@estudiante.com",
    telefono: "3186543210",
    numero_identificacion: "1009012345",
    institucion_origen_nombre: "Universidad Externado de Colombia",
    programa_destino_nombre: "Comunicación Social",
    fecha_solicitud: "2025-07-22T11:30:00Z",
    numero_radicado: "HR-2025-006",
    estado: "En Revision",
    municipio_nombre: "Bogotá",
    departamento_nombre: "Cundinamarca"
  },
  {
    id_solicitud: 7,
    primer_nombre: "Santiago",
    segundo_nombre: "Mateo",
    primer_apellido: "Jiménez",
    segundo_apellido: "Rojas",
    email: "santiago.jimenez@estudiante.com",
    telefono: "3145678901",
    numero_identificacion: "1010123456",
    institucion_origen_nombre: "Universidad Pontificia Bolivariana",
    programa_destino_nombre: "Arquitectura",
    fecha_solicitud: "2025-07-08T13:45:00Z",
    numero_radicado: "HR-2025-007",
    estado: "Rechazada",
    municipio_nombre: "Medellín",
    departamento_nombre: "Antioquia"
  },
  {
    id_solicitud: 8,
    primer_nombre: "Camila",
    segundo_nombre: "Andrea",
    primer_apellido: "Ruiz",
    segundo_apellido: "Sánchez",
    email: "camila.ruiz@estudiante.com",
    telefono: "3167890123",
    numero_identificacion: "1011234567",
    institucion_origen_nombre: "Universidad EAFIT",
    programa_destino_nombre: "Medicina",
    fecha_solicitud: "2025-07-24T15:10:00Z",
    numero_radicado: "HR-2025-008",
    estado: "Radicado",
    municipio_nombre: "Medellín",
    departamento_nombre: "Antioquia"
  },
  {
    id_solicitud: 9,
    primer_nombre: "Andrés",
    segundo_nombre: "Felipe",
    primer_apellido: "Mora",
    segundo_apellido: "Delgado",
    email: "andres.mora@estudiante.com",
    telefono: "3134567890",
    numero_identificacion: "1012345678",
    institucion_origen_nombre: "Universidad Católica Luis Amigó",
    programa_destino_nombre: "Contaduría Pública",
    fecha_solicitud: "2025-07-12T10:15:00Z",
    numero_radicado: "HR-2025-009",
    estado: "Aprobada",
    municipio_nombre: "Medellín",
    departamento_nombre: "Antioquia"
  },
  {
    id_solicitud: 10,
    primer_nombre: "Isabella",
    segundo_nombre: "Valentina",
    primer_apellido: "García",
    segundo_apellido: "Hernández",
    email: "isabella.garcia@estudiante.com",
    telefono: "3198765432",
    numero_identificacion: "1013456789",
    institucion_origen_nombre: "Universidad Minuto de Dios",
    programa_destino_nombre: "Trabajo Social",
    fecha_solicitud: "2025-07-20T16:45:00Z",
    numero_radicado: "HR-2025-010",
    estado: "En Revision",
    municipio_nombre: "Popayán",
    departamento_nombre: "Cauca"
  },
  {
    id_solicitud: 11,
    primer_nombre: "Sebastián",
    segundo_nombre: "David",
    primer_apellido: "Ortiz",
    segundo_apellido: "Peña",
    email: "sebastian.ortiz@estudiante.com",
    telefono: "3112345678",
    numero_identificacion: "1014567890",
    institucion_origen_nombre: "Universidad Santo Tomás",
    programa_destino_nombre: "Ingeniería Civil",
    fecha_solicitud: "2025-07-14T09:30:00Z",
    numero_radicado: "HR-2025-011",
    estado: "Radicado",
    municipio_nombre: "Bucaramanga",
    departamento_nombre: "Santander"
  },
  {
    id_solicitud: 12,
    primer_nombre: "María",
    segundo_nombre: "Fernanda",
    primer_apellido: "Suárez",
    segundo_apellido: "Vega",
    email: "maria.suarez@estudiante.com",
    telefono: "3176543210",
    numero_identificacion: "1015678901",
    institucion_origen_nombre: "Universidad Católica de Colombia",
    programa_destino_nombre: "Enfermería",
    fecha_solicitud: "2025-07-05T14:20:00Z",
    numero_radicado: "HR-2025-012",
    estado: "Rechazada",
    municipio_nombre: "Bogotá",
    departamento_nombre: "Cundinamarca"
  }
]

export default function HomologacionesVista() {
  const router = useRouter()
  
  // Estados para datos (usando mock data)
  const [coordinador] = useState(mockCoordinador)
  const [solicitudes] = useState(mockSolicitudes)
  const [solicitudesFiltradas, setSolicitudesFiltradas] = useState(mockSolicitudes)
  
  // Estados de UI simulados
  const [loadingCoordinador, setLoadingCoordinador] = useState(true)
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(true)
  
  // Estados de filtros
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [ordenamiento, setOrdenamiento] = useState('fecha_desc')

  // Estados disponibles
  const estadosDisponibles = [
    { id: 'todos', label: 'Todas las Solicitudes', color: 'gray', count: 0 },
    { id: 'Radicado', label: 'Radicadas', color: 'blue', count: 0 },
    { id: 'En Revision', label: 'En Revisión', color: 'yellow', count: 0 },
    { id: 'Aprobada', label: 'Aprobadas', color: 'green', count: 0 },
    { id: 'Rechazada', label: 'Rechazadas', color: 'red', count: 0 }
  ]

  // Simular carga de datos
  useEffect(() => {
    setTimeout(() => {
      setLoadingCoordinador(false)
    }, 800)
    
    setTimeout(() => {
      setLoadingSolicitudes(false)
    }, 1200)
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
      case 'En Revision': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Aprobada': return 'bg-green-100 text-green-800 border-green-200'
      case 'Rechazada': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Obtener icono del estado
  const obtenerIconoEstado = (estado) => {
    switch(estado) {
      case 'Radicado': return <Clock className="w-4 h-4" />
      case 'En Revision': return <AlertCircle className="w-4 h-4" />
      case 'Aprobada': return <CheckCircle className="w-4 h-4" />
      case 'Rechazada': return <XCircle className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  // Función de actualización simulada
  const actualizarDatos = () => {
    setLoadingSolicitudes(true)
    setTimeout(() => {
      setLoadingSolicitudes(false)
      // Aquí podrías simular nuevos datos o mantener los existentes
    }, 1000)
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
        (s.institucion_origen_nombre || '').toLowerCase().includes(terminoBusqueda)
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

  // Configurar usuario para sidebar
  const currentUser = {
    name: coordinador ? 
      `${obtenerDatoSeguro(coordinador.primer_nombre, 'Nombre')} ${obtenerDatoSeguro(coordinador.primer_apellido, 'Apellido')}` :
      'Usuario no encontrado',
    email: coordinador ? 
      obtenerDatoSeguro(coordinador.email, 'Email no encontrado') :
      'Email no encontrado'
  }

  // Navegación a subvistas (simulada)
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
            <span className="text-gray-600">{obtenerDatoSeguro(solicitud.telefono, 'Teléfono no encontrado')}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{obtenerDatoSeguro(solicitud.numero_identificacion, 'Identificación no encontrada')}</span>
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
              {obtenerDatoSeguro(solicitud.municipio_nombre, 'Ciudad no encontrada')}, {obtenerDatoSeguro(solicitud.departamento_nombre, 'Departamento no encontrado')}
            </span>
          </div>
        </div>
      </div>

      {/* Programa destino */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4">
        <p className="text-sm text-gray-600 mb-1">Programa de destino:</p>
        <p className="font-medium text-blue-900">{obtenerDatoSeguro(solicitud.programa_destino_nombre, 'Programa no encontrado')}</p>
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
                      placeholder="Buscar por nombre, radicado, email..."
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
                    {/* Aquí se pueden agregar más filtros en el futuro */}
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
                    <div className="flex space-x-3">
                      <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
                      <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
                      <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
                    </div>
                  </div>
                ))}
                <div className="text-center py-8">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Cargando solicitudes...</p>
                </div>
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
                    key={solicitud.id_solicitud || Math.random()} 
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