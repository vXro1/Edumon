'use client'

import SidebarLayout from '../../../../../layouts/SidebarLayout'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft,
  User,
  GraduationCap,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  Settings,
  Eye,
  FolderOpen,
  Plus,
  Trash2,
  Save,
  AlertTriangle,
  RefreshCw,
  Search,
  FileText,
  Award,
  Target,
  Hash,
  Calendar,
  X,
  ChevronDown,
  ChevronUp,
  Filter,
  ArrowRight,
  Timer,
  BookMinus
} from 'lucide-react'

export default function GestionarProcesoHomologacion() {
  const router = useRouter()
  const params = useParams()
  const solicitudId = params.id

  // Estados para datos de la API
  const [homologacion, setHomologacion] = useState(null)
  const [asignaturasDisponibles, setAsignaturasDisponibles] = useState([])
  const [asignaturasAsignadas, setAsignaturasAsignadas] = useState([])
  
  // Estados de carga y errores
  const [loadingHomologacion, setLoadingHomologacion] = useState(true)
  const [loadingAsignaturas, setLoadingAsignaturas] = useState(false)
  const [loadingGuardar, setLoadingGuardar] = useState(false)
  const [error, setError] = useState(null)

  // Estados de UI
  const [modalAsignaturasAbierto, setModalAsignaturasAbierto] = useState(false)
  const [modalContenidoAbierto, setModalContenidoAbierto] = useState(false)
  const [asignaturaParaContenido, setAsignaturaParaContenido] = useState(null)
  const [tipoAsignaturaContenido, setTipoAsignaturaContenido] = useState(null) // 'origen' o 'destino'
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState(null)
  const [indiceAsignaturaOrigen, setIndiceAsignaturaOrigen] = useState(null)
  const [busquedaAsignaturas, setBusquedaAsignaturas] = useState('')
  
  // Estados de filtros
  const [semestreSeleccionado, setSemestreSeleccionado] = useState('todos')
  const [asignaturaExpandida, setAsignaturaExpandida] = useState(null)

  // Usuario para el sidebar
  const currentUser = {
    name: 'Coordinador',
    email: 'coordinador@unicauca.edu.co'
  }

  // Cargar homologación específica
  const cargarHomologacion = async () => {
    try {
      setLoadingHomologacion(true)
      setError(null)
      
      const response = await fetch(`http://127.0.0.1:8000/api/homologacion-asignaturas/${solicitudId}`)
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (!data.datos) {
        throw new Error('Datos de homologación no encontrados')
      }
      
      setHomologacion(data.datos)
      
      // Inicializar asignaturas asignadas basándose en los datos existentes
      const asignadas = data.datos.asignaturas_origen.map((origen, index) => ({
        asignatura_origen: origen,
        asignatura_destino: data.datos.asignaturas_destino[index] || null,
        nota_destino: data.datos.asignaturas_destino[index]?.nota_destino || ''
      }))
      
      setAsignaturasAsignadas(asignadas)
      console.log('Homologación cargada:', data.datos)
      
    } catch (error) {
      console.error('Error al cargar homologación:', error)
      setError(error.message)
    } finally {
      setLoadingHomologacion(false)
    }
  }

  // Cargar asignaturas disponibles de la Universidad Autónoma del Cauca
  const cargarAsignaturasDisponibles = async () => {
    try {
      setLoadingAsignaturas(true)
      
      const response = await fetch('http://127.0.0.1:8000/api/asignaturas')
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (Array.isArray(data)) {
        // Filtrar solo las asignaturas de la Universidad Autónoma del Cauca
        const asignaturasAutonoma = data.filter(asignatura => 
          asignatura.institucion && 
          asignatura.institucion.includes('CORPORACION UNIVERSITARIA AUTONOMA DEL CAUCA')
        )
        
        setAsignaturasDisponibles(asignaturasAutonoma)
        console.log('Asignaturas de la Autónoma cargadas:', asignaturasAutonoma.length)
      } else {
        throw new Error('Formato de respuesta de asignaturas incorrecto')
      }
      
    } catch (error) {
      console.error('Error al cargar asignaturas disponibles:', error)
      // No es crítico, continuar sin asignaturas disponibles
    } finally {
      setLoadingAsignaturas(false)
    }
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    if (solicitudId) {
      cargarHomologacion()
      cargarAsignaturasDisponibles()
    }
  }, [solicitudId])

  // Funciones de utilidad
  const obtenerDatoSeguro = (valor, fallback = 'No disponible') => {
    return valor && valor.toString().trim() !== '' ? valor : fallback
  }

  const formatearFecha = (fechaString) => {
    if (!fechaString) return 'No disponible'
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

  const obtenerColorEstado = (estado) => {
    switch(estado) {
      case 'Pendiente': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'En proceso': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Aprobado': return 'bg-green-100 text-green-800 border-green-200'
      case 'Rechazado': return 'bg-red-100 text-red-800 border-red-200'
      case 'Finalizado': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const obtenerIconoEstado = (estado) => {
    switch(estado) {
      case 'Pendiente': return <Clock className="w-4 h-4" />
      case 'En proceso': return <AlertCircle className="w-4 h-4" />
      case 'Aprobado': return <CheckCircle className="w-4 h-4" />
      case 'Rechazado': return <XCircle className="w-4 h-4" />
      case 'Finalizado': return <Award className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  // Verificar si es tipo SENA
  const esTipoSena = () => {
    return asignaturasAsignadas.some(item => 
      item.asignatura_origen.horas_sena !== undefined && 
      item.asignatura_origen.horas_sena !== null
    )
  }

  // Obtener semestres únicos
  const obtenerSemestres = () => {
    const semestres = [...new Set(asignaturasAsignadas.map(item => item.asignatura_origen.semestre))]
    return semestres.sort((a, b) => a - b)
  }

  // Filtrar asignaturas por semestre
  const asignaturasFiltradas = semestreSeleccionado === 'todos' 
    ? asignaturasAsignadas 
    : asignaturasAsignadas.filter(item => item.asignatura_origen.semestre == semestreSeleccionado)

  // Navegación
  const volverAtras = () => {
    router.back()
  }

  const irAVerInformacion = () => {
    router.push(`/coordinador/homologaciones/${solicitudId}/ver-informacion`)
  }

  const irAVerDocumentos = () => {
    router.push(`/coordinador/homologaciones/${solicitudId}/ver-documentos`)
  }

  // Funciones de gestión de asignaturas
  const abrirModalAsignaturas = (indiceOrigen) => {
    setIndiceAsignaturaOrigen(indiceOrigen)
    setModalAsignaturasAbierto(true)
    setBusquedaAsignaturas('')
  }

  const cerrarModalAsignaturas = () => {
    setModalAsignaturasAbierto(false)
    setAsignaturaSeleccionada(null)
    setIndiceAsignaturaOrigen(null)
  }

  const abrirModalContenido = (asignatura, tipo) => {
    setAsignaturaParaContenido(asignatura)
    setTipoAsignaturaContenido(tipo)
    setModalContenidoAbierto(true)
  }

  const cerrarModalContenido = () => {
    setModalContenidoAbierto(false)
    setAsignaturaParaContenido(null)
    setTipoAsignaturaContenido(null)
  }

  const asignarAsignaturaDestino = (asignaturaDestino) => {
    if (indiceAsignaturaOrigen !== null) {
      const nuevasAsignadas = [...asignaturasAsignadas]
      nuevasAsignadas[indiceAsignaturaOrigen] = {
        ...nuevasAsignadas[indiceAsignaturaOrigen],
        asignatura_destino: asignaturaDestino,
        nota_destino: nuevasAsignadas[indiceAsignaturaOrigen].nota_destino || ''
      }
      setAsignaturasAsignadas(nuevasAsignadas)
      cerrarModalAsignaturas()
    }
  }

  const removerAsignaturaDestino = (indice) => {
    const nuevasAsignadas = [...asignaturasAsignadas]
    nuevasAsignadas[indice] = {
      ...nuevasAsignadas[indice],
      asignatura_destino: null,
      nota_destino: ''
    }
    setAsignaturasAsignadas(nuevasAsignadas)
  }

  const actualizarNotaDestino = (indice, nota) => {
    const nuevasAsignadas = [...asignaturasAsignadas]
    nuevasAsignadas[indice] = {
      ...nuevasAsignadas[indice],
      nota_destino: nota
    }
    setAsignaturasAsignadas(nuevasAsignadas)
  }

  const toggleAsignaturaExpandida = (indice) => {
    setAsignaturaExpandida(asignaturaExpandida === indice ? null : indice)
  }

  // Filtrar asignaturas disponibles
  const asignaturasDisponiblesFiltradas = asignaturasDisponibles.filter(asignatura =>
    asignatura.nombre.toLowerCase().includes(busquedaAsignaturas.toLowerCase()) ||
    asignatura.codigo.toLowerCase().includes(busquedaAsignaturas.toLowerCase()) ||
    asignatura.programa.toLowerCase().includes(busquedaAsignaturas.toLowerCase())
  )

  // Guardar cambios
  const guardarCambios = async () => {
    try {
      setLoadingGuardar(true)
      
      // Preparar datos para la API
      const homologaciones = asignaturasAsignadas.map(item => ({
        asignatura_origen_id: item.asignatura_origen.id,
        asignatura_destino_id: item.asignatura_destino?.id || null,
        nota_destino: item.nota_destino ? parseFloat(item.nota_destino) : null
      }))

      const response = await fetch(`http://127.0.0.1:8000/api/homologacion-asignaturas/${homologacion.id_homologacion}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          solicitud_id: homologacion.solicitud_id,
          homologaciones: JSON.stringify(homologaciones),
          fecha: new Date().toISOString().split('T')[0]
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.mensaje || `Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Cambios guardados:', data)
      
      // Recargar homologación para obtener datos actualizados
      await cargarHomologacion()
      
      alert('Cambios guardados correctamente')
      
    } catch (error) {
      console.error('Error al guardar cambios:', error)
      alert(`Error al guardar: ${error.message}`)
    } finally {
      setLoadingGuardar(false)
    }
  }

  // Cambiar estado de homologación
  const cambiarEstado = async (nuevoEstado) => {
    try {
      if (!homologacion) return
      
      const response = await fetch(`http://127.0.0.1:8000/api/homologacion-asignaturas/usuario/${homologacion.solicitud_id}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estado: nuevoEstado
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.mensaje || `Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Estado actualizado:', data)
      
      // Recargar homologación
      await cargarHomologacion()
      
      alert(`Estado actualizado a: ${nuevoEstado}`)
      
    } catch (error) {
      console.error('Error al cambiar estado:', error)
      alert(`Error al cambiar estado: ${error.message}`)
    }
  }

  if (loadingHomologacion) {
    return (
      <SidebarLayout userRole="coordinacion" currentUser={currentUser}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="neu-card p-8 animate-pulse">
              <div className="flex items-center space-x-4 mb-8">
                <div className="h-10 w-10 bg-gray-200 rounded-xl"></div>
                <div className="h-8 bg-gray-200 rounded-md w-64"></div>
              </div>
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
              <div className="text-center py-8">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Cargando proceso de homologación...</p>
              </div>
            </div>
          </div>
        </div>
      </SidebarLayout>
    )
  }

  if (error) {
    return (
      <SidebarLayout userRole="coordinacion" currentUser={currentUser}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="neu-card p-12 text-center">
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-600 mb-2">
                Error al cargar la homologación
              </h3>
              <p className="text-red-500 mb-6">{error}</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={volverAtras}
                  className="neu-button px-6 py-3 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver</span>
                </button>
                <button
                  onClick={cargarHomologacion}
                  className="neu-button-primary px-6 py-3 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reintentar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </SidebarLayout>
    )
  }

  return (
    <SidebarLayout userRole="coordinacion" currentUser={currentUser}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="neu-card p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={volverAtras}
                  className="neu-button p-3 rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  <ArrowLeft className="w-5 h-5 text-blue-600" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Settings className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-blue-900">Cruce de Materias - Homologación</h1>
                    <p className="text-gray-600">
                      Radicado: {obtenerDatoSeguro(homologacion?.numero_radicado)} | 
                      {esTipoSena() ? ' Tipo: SENA' : ' Tipo: Universidad'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Estado actual */}
                <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium border ${obtenerColorEstado(homologacion?.estado_solicitud)}`}>
                  {obtenerIconoEstado(homologacion?.estado_solicitud)}
                  <span>{obtenerDatoSeguro(homologacion?.estado_solicitud)}</span>
                </span>
                
                {/* Botón ver información */}
                <button
                  onClick={irAVerInformacion}
                  className="neu-button px-6 py-3 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
                >
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Ver Información</span>
                </button>
                
                {/* Botón ver documentos */}
                <button
                  onClick={irAVerDocumentos}
                  className="neu-button px-6 py-3 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
                >
                  <FolderOpen className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Ver Documentos</span>
                </button>
              </div>
            </div>
          </div>

          {/* Información del estudiante */}
          {homologacion && (
            <div className="neu-card p-6 mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-blue-900">Información del Estudiante</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Estudiante</label>
                  <p className="text-lg font-semibold text-gray-900">{obtenerDatoSeguro(homologacion.estudiante)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Identificación</label>
                  <p className="text-gray-900">{obtenerDatoSeguro(homologacion.numero_identificacion)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Programa Destino</label>
                  <p className="text-gray-900">{obtenerDatoSeguro(homologacion.programa_destino)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha de Homologación</label>
                  <p className="text-gray-900">{formatearFecha(homologacion.fecha)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Filtros y controles */}
          <div className="neu-card p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {/* Filtro por semestre */}
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <select
                    value={semestreSeleccionado}
                    onChange={(e) => setSemestreSeleccionado(e.target.value)}
                    className="neu-card px-3 py-2 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 text-sm font-medium text-blue-900"
                  >
                    <option value="todos">Todos los semestres</option>
                    {obtenerSemestres().map(semestre => (
                      <option key={semestre} value={semestre}>Semestre {semestre}</option>
                    ))}
                  </select>
                </div>
                
                <div className="text-sm text-gray-600">
                  {asignaturasFiltradas.length} de {asignaturasAsignadas.length} asignaturas
                </div>
              </div>
              
              <button
                onClick={guardarCambios}
                disabled={loadingGuardar}
                className="neu-button-primary px-6 py-3 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingGuardar ? (
                  <>
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                    <span className="font-medium text-white">Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-white" />
                    <span className="font-medium text-white">Guardar Cambios</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Lista de asignaturas */}
          <div className="space-y-6">
            {asignaturasFiltradas.map((item, index) => {
              const indiceOriginal = asignaturasAsignadas.findIndex(a => a.asignatura_origen.id === item.asignatura_origen.id)
              const estaExpandida = asignaturaExpandida === indiceOriginal
              
              return (
                <div key={indiceOriginal} className="neu-card overflow-hidden">
                  {/* Header de la asignatura */}
                  <div 
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => toggleAsignaturaExpandida(indiceOriginal)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Número de semestre */}
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                          {item.asignatura_origen.semestre}
                        </div>
                        
                        {/* Información de la asignatura origen */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {item.asignatura_origen.nombre}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center space-x-1">
                              <Hash className="w-4 h-4" />
                              <span>{item.asignatura_origen.codigo}</span>
                            </span>
                            {esTipoSena() ? (
                              <span className="flex items-center space-x-1">
                                <Timer className="w-4 h-4" />
                                <span>{item.asignatura_origen.horas_sena} horas</span>
                              </span>
                            ) : (
                              <span className="flex items-center space-x-1">
                                <Award className="w-4 h-4" />
                                <span>{item.asignatura_origen.creditos} créditos</span>
                              </span>
                            )}
                            <span className="flex items-center space-x-1">
                              <Target className="w-4 h-4" />
                              <span>Nota: {item.asignatura_origen.nota_origen}</span>
                            </span>
                          </div>
                        </div>
                        
                        {/* Estado de asignación */}
                        <div className="flex items-center space-x-2">
                          {item.asignatura_destino ? (
                            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                              Asignada
                            </div>
                          ) : (
                            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                              Pendiente
                            </div>
                          )}
                          
                          {estaExpandida ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contenido expandible */}
                  {estaExpandida && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          
                          {/* Asignatura Origen */}
                          <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-semibold text-blue-900 flex items-center space-x-2">
                                <BookOpen className="w-4 h-4" />
                                <span>Asignatura Origen</span>
                              </h4>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  abrirModalContenido(item.asignatura_origen, 'origen')
                                }}
                                className="neu-button px-3 py-1 rounded-lg text-xs hover:shadow-lg transition-all duration-300"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Ver Pensum
                              </button>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <p><strong>Nombre:</strong> {item.asignatura_origen.nombre}</p>
                              <p><strong>Código:</strong> {item.asignatura_origen.codigo}</p>
                              <p><strong>Semestre:</strong> {item.asignatura_origen.semestre}</p>
                              {esTipoSena() ? (
                                <p><strong>Horas SENA:</strong> {item.asignatura_origen.horas_sena}</p>
                              ) : (
                                <p><strong>Créditos:</strong> {item.asignatura_origen.creditos}</p>
                              )}
                              <p><strong>Nota Origen:</strong> {item.asignatura_origen.nota_origen}</p>
                            </div>
                          </div>
                          
                          {/* Asignatura Destino */}
                          <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-semibold text-green-900 flex items-center space-x-2">
                                <GraduationCap className="w-4 h-4" />
                                <span>Asignatura Destino (Autónoma)</span>
                              </h4>
                              <div className="flex items-center space-x-2">
                                {item.asignatura_destino && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      abrirModalContenido(item.asignatura_destino, 'destino')
                                    }}
                                    className="neu-button px-3 py-1 rounded-lg text-xs hover:shadow-lg transition-all duration-300"
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    Ver Pensum
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    abrirModalAsignaturas(indiceOriginal)
                                  }}
                                  className="neu-button-primary px-3 py-1 rounded-lg text-xs hover:shadow-lg transition-all duration-300"
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  {item.asignatura_destino ? 'Cambiar' : 'Asignar'}
                                </button>
                              </div>
                            </div>
                            
                            {item.asignatura_destino ? (
                              <div className="space-y-2 text-sm">
                                <p><strong>Nombre:</strong> {item.asignatura_destino.nombre}</p>
                                <p><strong>Código:</strong> {item.asignatura_destino.codigo}</p>
                                <p><strong>Programa:</strong> {item.asignatura_destino.programa}</p>
                                <p><strong>Semestre:</strong> {item.asignatura_destino.semestre}</p>
                                <p><strong>Créditos:</strong> {item.asignatura_destino.creditos}</p>
                                
                                <div className="flex items-center space-x-2 mt-3">
                                  <label className="font-medium">Nota Destino:</label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    value={item.nota_destino}
                                    onChange={(e) => {
                                      e.stopPropagation()
                                      actualizarNotaDestino(indiceOriginal, e.target.value)
                                    }}
                                    className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="0.0"
                                  />
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      removerAsignaturaDestino(indiceOriginal)
                                    }}
                                    className="neu-button p-1 rounded-lg hover:shadow-lg transition-all duration-300"
                                    title="Remover asignación"
                                  >
                                    <Trash2 className="w-3 h-3 text-red-600" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-8 text-gray-500">
                                <BookMinus className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm">Sin asignatura asignada</p>
                                <p className="text-xs">Haz clic en "Asignar" para seleccionar una asignatura</p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Línea de conexión visual */}
                        <div className="flex items-center justify-center my-4">
                          <div className="flex items-center space-x-2 text-gray-400">
                            <div className="w-8 h-px bg-gray-300"></div>
                            <ArrowRight className="w-4 h-4" />
                            <div className="w-8 h-px bg-gray-300"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            
            {asignaturasFiltradas.length === 0 && (
              <div className="neu-card p-12 text-center">
                <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No hay asignaturas para este semestre
                </h3>
                <p className="text-gray-500">
                  Selecciona "Todos los semestres" para ver todas las asignaturas
                </p>
              </div>
            )}
          </div>

          {/* Controles de estado */}
          <div className="neu-card p-6 mt-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Settings className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-blue-900">Control de Estado del Proceso</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {['Pendiente', 'En proceso', 'Aprobado', 'Rechazado', 'Finalizado'].map(estado => (
                <button
                  key={estado}
                  onClick={() => cambiarEstado(estado)}
                  className={`neu-button px-4 py-3 rounded-xl flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-300 ${
                    homologacion?.estado_solicitud === estado ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                >
                  {obtenerIconoEstado(estado)}
                  <span className="font-medium text-blue-900">{estado}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Comentarios sobre el proceso:</h4>
              <p className="text-gray-700 text-sm">
                {homologacion?.comentarios || 'Sin comentarios registrados'}
              </p>
            </div>
          </div>

          {/* Modal de selección de asignaturas */}
          {modalAsignaturasAbierto && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-xl shadow-2xl w-11/12 h-5/6 max-w-6xl flex flex-col">
                {/* Header del modal */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Seleccionar Asignatura de la Universidad Autónoma del Cauca
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Asignaturas disponibles del programa de destino
                    </p>
                  </div>
                  <button
                    onClick={cerrarModalAsignaturas}
                    className="neu-button p-2 rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                
                {/* Búsqueda */}
                <div className="p-6 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar asignaturas por nombre, código o programa..."
                      value={busquedaAsignaturas}
                      onChange={(e) => setBusquedaAsignaturas(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {asignaturasDisponiblesFiltradas.length} asignaturas encontradas de la Universidad Autónoma del Cauca
                  </p>
                </div>
                
                {/* Lista de asignaturas */}
                <div className="flex-1 overflow-y-auto p-6">
                  {loadingAsignaturas ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                      <p className="text-gray-600">Cargando asignaturas de la Universidad Autónoma...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {asignaturasDisponiblesFiltradas.map((asignatura) => (
                        <div
                          key={asignatura.id}
                          onClick={() => asignarAsignaturaDestino(asignatura)}
                          className="neu-card p-4 cursor-pointer hover:shadow-lg transition-all duration-300 border-l-4 border-green-500"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-2">{asignatura.nombre}</h4>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                  <Hash className="w-4 h-4" />
                                  <span>Código: {asignatura.codigo}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-4 h-4" />
                                  <span>Semestre: {asignatura.semestre}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Award className="w-4 h-4" />
                                  <span>Créditos: {asignatura.creditos}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <GraduationCap className="w-4 h-4" />
                                  <span>{asignatura.programa}</span>
                                </div>
                              </div>
                              
                              <div className="mt-2 text-sm text-gray-500">
                                Facultad: {asignatura.facultad} | {asignatura.institucion}
                              </div>
                              
                              {asignatura.contenido_programatico && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                  <h5 className="font-medium text-gray-800 mb-1">Contenido Programático:</h5>
                                  <p className="text-sm text-gray-600">{asignatura.contenido_programatico.tema}</p>
                                  {asignatura.contenido_programatico.descripcion && (
                                    <p className="text-xs text-gray-500 mt-1">{asignatura.contenido_programatico.descripcion}</p>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <div className="ml-4 flex items-center">
                              <Plus className="w-5 h-5 text-green-600" />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {asignaturasDisponiblesFiltradas.length === 0 && (
                        <div className="text-center py-12">
                          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            No se encontraron asignaturas
                          </h3>
                          <p className="text-gray-500">
                            Intenta ajustar los términos de búsqueda o verifica que las asignaturas estén disponibles
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Modal de contenido programático */}
          {modalContenidoAbierto && asignaturaParaContenido && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-xl shadow-2xl w-11/12 h-4/5 max-w-4xl flex flex-col">
                {/* Header del modal */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Contenido Programático - {tipoAsignaturaContenido === 'origen' ? 'Asignatura Origen' : 'Asignatura Destino'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {asignaturaParaContenido.nombre}
                    </p>
                  </div>
                  <button
                    onClick={cerrarModalContenido}
                    className="neu-button p-2 rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                
                {/* Información de la asignatura */}
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Código:</span>
                      <p className="text-gray-900">{asignaturaParaContenido.codigo}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Semestre:</span>
                      <p className="text-gray-900">{asignaturaParaContenido.semestre}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        {esTipoSena() && tipoAsignaturaContenido === 'origen' ? 'Horas SENA:' : 'Créditos:'}
                      </span>
                      <p className="text-gray-900">
                        {esTipoSena() && tipoAsignaturaContenido === 'origen' 
                          ? asignaturaParaContenido.horas_sena 
                          : asignaturaParaContenido.creditos
                        }
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Programa:</span>
                      <p className="text-gray-900">{asignaturaParaContenido.programa || 'No especificado'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Contenido programático */}
                <div className="flex-1 overflow-y-auto p-6">
                  {asignaturaParaContenido.contenido_programatico ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                          <BookOpen className="w-4 h-4" />
                          <span>Tema Principal</span>
                        </h4>
                        <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">
                          {asignaturaParaContenido.contenido_programatico.tema}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                          <Target className="w-4 h-4" />
                          <span>Resultados de Aprendizaje</span>
                        </h4>
                        <p className="text-gray-700 bg-green-50 p-4 rounded-lg">
                          {asignaturaParaContenido.contenido_programatico.resultados_aprendizaje}
                        </p>
                      </div>
                      
                      {asignaturaParaContenido.contenido_programatico.descripcion && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                            <FileText className="w-4 h-4" />
                            <span>Descripción del Curso</span>
                          </h4>
                          <p className="text-gray-700 bg-yellow-50 p-4 rounded-lg">
                            {asignaturaParaContenido.contenido_programatico.descripcion}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookMinus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        Contenido programático no disponible
                      </h3>
                      <p className="text-gray-500">
                        No se encontró información del contenido programático para esta asignatura
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  )
}