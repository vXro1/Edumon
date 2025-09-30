'use client'

import SidebarLayout from '../../../../../layouts/SidebarLayout'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  GraduationCap,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  Settings,
  Eye,
  AlertTriangle,
  RefreshCw,
  ExternalLink
} from 'lucide-react'

export default function VerInformacionSolicitud() {
  const router = useRouter()
  const params = useParams()
  const solicitudId = params.id

  // Estados para datos de la API
  const [solicitud, setSolicitud] = useState(null)
  const [institucion, setInstitucion] = useState(null)
  
  // Estados de carga y errores
  const [loadingSolicitud, setLoadingSolicitud] = useState(true)
  const [loadingInstitucion, setLoadingInstitucion] = useState(false)
  const [loadingActualizacion, setLoadingActualizacion] = useState(false)
  const [error, setError] = useState(null)
  const [errorInstitucion, setErrorInstitucion] = useState(null)

  // Usuario para el sidebar
  const currentUser = {
    name: 'Coordinador',
    email: 'coordinador@unicauca.edu.co'
  }

  // Cargar datos de la solicitud
  const cargarSolicitud = async () => {
    try {
      setLoadingSolicitud(true)
      setError(null)
      
      const response = await fetch(`http://127.0.0.1:8000/api/solicitudes/${solicitudId}`)
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (!data.datos) {
        throw new Error('Datos de solicitud no encontrados en la respuesta')
      }
      
      setSolicitud(data.datos)
      console.log('Solicitud cargada:', data.datos)
      
      // Cargar información de la institución si existe
      if (data.datos.institucion_origen_nombre) {
        await cargarInstitucion(data.datos.institucion_origen_nombre)
      }
      
    } catch (error) {
      console.error('Error al cargar solicitud:', error)
      setError(error.message)
    } finally {
      setLoadingSolicitud(false)
    }
  }

  // Cargar datos de la institución
  const cargarInstitucion = async (nombreInstitucion) => {
    try {
      setLoadingInstitucion(true)
      setErrorInstitucion(null)
      
      const response = await fetch('http://127.0.0.1:8000/api/instituciones')
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const instituciones = await response.json()
      
      if (!Array.isArray(instituciones)) {
        throw new Error('Formato de respuesta de instituciones incorrecto')
      }
      
      // Buscar la institución por nombre (comparación flexible)
      const institucionEncontrada = instituciones.find(inst => 
        inst.nombre && nombreInstitucion && 
        inst.nombre.toLowerCase().includes(nombreInstitucion.toLowerCase()) ||
        nombreInstitucion.toLowerCase().includes(inst.nombre.toLowerCase())
      )
      
      if (institucionEncontrada) {
        setInstitucion(institucionEncontrada)
        console.log('Institución encontrada:', institucionEncontrada)
      } else {
        console.log('Institución no encontrada en la base de datos')
        setErrorInstitucion('Información de institución no encontrada en la base de datos')
      }
      
    } catch (error) {
      console.error('Error al cargar institución:', error)
      setErrorInstitucion(error.message)
    } finally {
      setLoadingInstitucion(false)
    }
  }

  // Actualizar estado de la solicitud
  const actualizarEstado = async () => {
    if (!solicitud || solicitud.estado !== 'Radicado') {
      return
    }

    try {
      setLoadingActualizacion(true)
      
      const response = await fetch(`http://127.0.0.1:8000/api/solicitudes/${solicitudId}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estado: 'En revisión'
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.mensaje || `Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Estado actualizado:', data)
      
      // Actualizar el estado local
      setSolicitud(prev => ({
        ...prev,
        estado: 'En revisión'
      }))
      
      // Mostrar mensaje de éxito (opcional: podrías usar un toast)
      alert('Estado actualizado correctamente de "Radicado" a "En revisión"')
      
    } catch (error) {
      console.error('Error al actualizar estado:', error)
      alert(`Error al actualizar estado: ${error.message}`)
    } finally {
      setLoadingActualizacion(false)
    }
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    if (solicitudId) {
      cargarSolicitud()
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

  const obtenerNombreCompleto = () => {
    if (!solicitud) return 'Nombre no disponible'
    
    const partes = [
      solicitud.primer_nombre,
      solicitud.segundo_nombre,
      solicitud.primer_apellido,
      solicitud.segundo_apellido
    ].filter(parte => parte && parte.trim() !== '')
    
    return partes.length > 0 ? partes.join(' ') : 'Nombre no disponible'
  }

  const obtenerColorEstado = (estado) => {
    switch(estado) {
      case 'Radicado': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'En revisión': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Aprobado': return 'bg-green-100 text-green-800 border-green-200'
      case 'Rechazado': return 'bg-red-100 text-red-800 border-red-200'
      case 'Cerrado': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const obtenerIconoEstado = (estado) => {
    switch(estado) {
      case 'Radicado': return <Clock className="w-5 h-5" />
      case 'En revisión': return <AlertCircle className="w-5 h-5" />
      case 'Aprobado': return <CheckCircle className="w-5 h-5" />
      case 'Rechazado': return <XCircle className="w-5 h-5" />
      case 'Cerrado': return <FileText className="w-5 h-5" />
      default: return <FileText className="w-5 h-5" />
    }
  }

  // Navegación
  const volverAtras = () => {
    router.back()
  }

  const irAGestionarProceso = () => {
    router.push(`/coordinador/homologaciones/${solicitudId}/gestionar-proceso`)
  }

  if (loadingSolicitud) {
    return (
      <SidebarLayout userRole="coordinacion" currentUser={currentUser}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="neu-card p-8 animate-pulse">
              <div className="flex items-center justify-between mb-8">
                <div className="h-8 bg-gray-200 rounded-md w-64"></div>
                <div className="h-10 bg-gray-200 rounded-xl w-32"></div>
              </div>
              <div className="space-y-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
              <div className="text-center py-8">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Cargando información de la solicitud...</p>
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
          <div className="max-w-6xl mx-auto">
            <div className="neu-card p-12 text-center">
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-600 mb-2">
                Error al cargar la solicitud
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
                  onClick={cargarSolicitud}
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
        <div className="max-w-6xl mx-auto">
          
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
                <div>
                  <h1 className="text-2xl font-bold text-blue-900">Información de Solicitud</h1>
                  <p className="text-gray-600">
                    Radicado: {obtenerDatoSeguro(solicitud?.numero_radicado)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Estado actual */}
                <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium border ${obtenerColorEstado(solicitud?.estado)}`}>
                  {obtenerIconoEstado(solicitud?.estado)}
                  <span>{obtenerDatoSeguro(solicitud?.estado)}</span>
                </span>
                
                {/* Botón gestionar proceso */}
                <button
                  onClick={irAGestionarProceso}
                  className="neu-button-primary px-6 py-3 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
                >
                  <Settings className="w-4 h-4 text-white" />
                  <span className="font-medium text-white">Gestionar Proceso</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Información del Estudiante */}
            <div className="neu-card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-blue-900">Información del Estudiante</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nombre Completo</label>
                  <p className="text-lg font-semibold text-gray-900">{obtenerNombreCompleto()}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tipo de Identificación</label>
                    <p className="text-gray-900">{obtenerDatoSeguro(solicitud?.tipo_identificacion)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Número de Identificación</label>
                    <p className="text-gray-900">{obtenerDatoSeguro(solicitud?.numero_identificacion)}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Correo Electrónico</span>
                  </label>
                  <p className="text-gray-900">{obtenerDatoSeguro(solicitud?.email)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Teléfono</span>
                  </label>
                  <p className="text-gray-900">{obtenerDatoSeguro(solicitud?.telefono)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Dirección</span>
                  </label>
                  <p className="text-gray-900">{obtenerDatoSeguro(solicitud?.direccion)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Ubicación</label>
                  <p className="text-gray-900">
                    {solicitud?.municipio_nombre && solicitud?.departamento_nombre 
                      ? `${solicitud.municipio_nombre}, ${solicitud.departamento_nombre}, ${obtenerDatoSeguro(solicitud.pais_nombre, 'Colombia')}`
                      : obtenerDatoSeguro(solicitud?.pais_nombre)
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Información Académica */}
            <div className="neu-card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-blue-900">Información Académica</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Programa de Destino</label>
                  <p className="text-lg font-semibold text-gray-900">{obtenerDatoSeguro(solicitud?.programa_destino_nombre)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Institución de Origen</label>
                  <p className="text-gray-900">{obtenerDatoSeguro(solicitud?.institucion_origen_nombre)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Estado de Estudios</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    {solicitud?.finalizo_estudios === 'Si' ? (
                      <div>
                        <p className="font-medium text-green-800">✓ Estudios Finalizados</p>
                        <p className="text-sm text-gray-600">
                          Fecha de finalización: {formatearFecha(solicitud.fecha_finalizacion_estudios)}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium text-orange-800">○ Estudios en Curso</p>
                        <p className="text-sm text-gray-600">
                          Último semestre cursado: {formatearFecha(solicitud.fecha_ultimo_semestre_cursado)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Fecha de Solicitud</span>
                  </label>
                  <p className="text-gray-900">{formatearFecha(solicitud?.fecha_solicitud)}</p>
                </div>
              </div>
            </div>

            {/* Información de la Institución */}
            <div className="neu-card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-blue-900">Información de la Institución</h2>
              </div>

              {loadingInstitucion ? (
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  <p className="text-sm text-gray-500">Cargando información de la institución...</p>
                </div>
              ) : errorInstitucion ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-yellow-800">
                    <AlertTriangle className="w-5 h-5" />
                    <p className="font-medium">Información no disponible</p>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">{errorInstitucion}</p>
                </div>
              ) : institucion ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nombre de la Institución</label>
                    <p className="text-lg font-semibold text-gray-900">{institucion.nombre}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Código IES</label>
                      <p className="text-gray-900">{obtenerDatoSeguro(institucion.codigo_ies)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Tipo</label>
                      <p className="text-gray-900">{obtenerDatoSeguro(institucion.tipo)}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Ubicación de la Institución</label>
                    <p className="text-gray-900">
                      {institucion.municipio && institucion.departamento 
                        ? `${institucion.municipio}, ${institucion.departamento}`
                        : obtenerDatoSeguro(institucion.municipio || institucion.departamento)
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-600">No se encontró información adicional de la institución en la base de datos.</p>
                </div>
              )}
            </div>

            {/* Acciones y Estado */}
            <div className="neu-card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Settings className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-blue-900">Acciones Disponibles</h2>
              </div>

              <div className="space-y-4">
                {/* Información del estado actual */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    {obtenerIconoEstado(solicitud?.estado)}
                    <span className="font-medium text-blue-900">Estado Actual: {obtenerDatoSeguro(solicitud?.estado)}</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    {solicitud?.estado === 'Radicado' && 'La solicitud está pendiente de revisión inicial.'}
                    {solicitud?.estado === 'En revisión' && 'La solicitud está siendo evaluada por el comité.'}
                    {solicitud?.estado === 'Aprobado' && 'La solicitud ha sido aprobada.'}
                    {solicitud?.estado === 'Rechazado' && 'La solicitud ha sido rechazada.'}
                    {solicitud?.estado === 'Cerrado' && 'El proceso de solicitud ha sido cerrado.'}
                  </p>
                </div>

                {/* Botón para cambiar estado si está radicado */}
                {solicitud?.estado === 'Radicado' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Acción Disponible</span>
                    </div>
                    <p className="text-sm text-yellow-700 mb-4">
                      Esta solicitud puede ser enviada a revisión. Al hacer clic en "Gestionar Proceso", 
                      el estado cambiará automáticamente de "Radicado" a "En revisión".
                    </p>
                    <button
                      onClick={actualizarEstado}
                      disabled={loadingActualizacion}
                      className="w-full neu-button-primary px-4 py-3 rounded-xl flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingActualizacion ? (
                        <>
                          <Loader2 className="w-4 h-4 text-white animate-spin" />
                          <span className="font-medium text-white">Actualizando...</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 text-white" />
                          <span className="font-medium text-white">Enviar a Revisión</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Información sobre próximos pasos */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Próximos Pasos:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {solicitud?.estado === 'Radicado' && (
                      <>
                        <li>• Revisar documentos adjuntos</li>
                        <li>• Enviar a proceso de revisión</li>
                        <li>• Asignar al comité evaluador</li>
                      </>
                    )}
                    {solicitud?.estado === 'En revisión' && (
                      <>
                        <li>• Esperar evaluación del comité</li>
                        <li>• Revisar observaciones</li>
                        <li>• Aprobar o rechazar solicitud</li>
                      </>
                    )}
                    {(solicitud?.estado === 'Aprobado' || solicitud?.estado === 'Rechazado') && (
                      <>
                        <li>• Notificar al estudiante</li>
                        <li>• Generar documentos finales</li>
                        <li>• Cerrar proceso si corresponde</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}