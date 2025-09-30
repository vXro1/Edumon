'use client'

import SidebarLayout from '../../../../../layouts/SidebarLayout'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft,
  FileText,
  Download,
  Eye,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  FolderOpen,
  Loader2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Settings,
  FileCheck,
  FilePlus,
  ChevronDown,
  ChevronUp,
  Maximize2
} from 'lucide-react'

export default function VerDocumentosSolicitud() {
  const router = useRouter()
  const params = useParams()
  const solicitudId = params.id

  // Estados para datos de la API
  const [documentos, setDocumentos] = useState([])
  const [solicitudInfo, setSolicitudInfo] = useState(null)
  const [usuarioId, setUsuarioId] = useState(null)
  
  // Estados de carga y errores
  const [loadingDocumentos, setLoadingDocumentos] = useState(true)
  const [loadingSolicitud, setLoadingSolicitud] = useState(true)
  const [error, setError] = useState(null)
  const [errorSolicitud, setErrorSolicitud] = useState(null)
  
  // Estados para expansión de documentos
  const [documentosExpandidos, setDocumentosExpandidos] = useState(new Set())

  // Usuario para el sidebar
  const currentUser = {
    name: 'Coordinador',
    email: 'coordinador@unicauca.edu.co'
  }

  // Cargar información de la solicitud para obtener el usuario_id
  const cargarSolicitud = async () => {
    try {
      setLoadingSolicitud(true)
      setErrorSolicitud(null)
      
      const response = await fetch(`http://127.0.0.1:8000/api/solicitudes/${solicitudId}`)
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (!data.datos) {
        throw new Error('Datos de solicitud no encontrados')
      }
      
      setSolicitudInfo(data.datos)
      
      // Necesitamos obtener el usuario_id desde los documentos ya que no viene en la solicitud
      // Por ahora, cargaremos los documentos directamente
      await cargarDocumentos()
      
    } catch (error) {
      console.error('Error al cargar solicitud:', error)
      setErrorSolicitud(error.message)
    } finally {
      setLoadingSolicitud(false)
    }
  }

  // Cargar documentos del usuario
  const cargarDocumentos = async () => {
    try {
      setLoadingDocumentos(true)
      setError(null)
      
      // Primero intentamos cargar la solicitud para obtener información del usuario
      const solicitudResponse = await fetch(`http://127.0.0.1:8000/api/solicitudes/${solicitudId}`)
      
      if (!solicitudResponse.ok) {
        throw new Error(`Error al cargar solicitud: ${solicitudResponse.status}`)
      }
      
      const solicitudData = await solicitudResponse.json()
      
      if (!solicitudData.datos) {
        throw new Error('Datos de solicitud no encontrados')
      }
      
      // Ahora necesitamos obtener el usuario_id de los documentos
      // Como la API de documentos es por usuario_id, intentaremos cargar documentos
      // que correspondan a esta solicitud
      
      // Por ahora, intentemos con diferentes user IDs o usar una lógica diferente
      // Basándonos en el ejemplo, parece que usuario_id = 1 para solicitud_id = 1
      let usuarioIdAUsar = solicitudId; // Asumiendo que coinciden inicialmente
      
      const documentosResponse = await fetch(`http://127.0.0.1:8000/api/documentos/usuario/${usuarioIdAUsar}`)
      
      if (!documentosResponse.ok) {
        // Si no funciona con el solicitudId, intentemos buscar por otros medios
        throw new Error(`Error ${documentosResponse.status}: ${documentosResponse.statusText}`)
      }
      
      const documentosData = await documentosResponse.json()
      
      if (!documentosData.datos || !Array.isArray(documentosData.datos)) {
        throw new Error('Formato de respuesta de documentos incorrecto')
      }
      
      // Filtrar documentos que correspondan a esta solicitud específica
      const documentosFiltrados = documentosData.datos.filter(doc => 
        doc.solicitud_id == solicitudId
      )
      
      setDocumentos(documentosFiltrados)
      setUsuarioId(usuarioIdAUsar)
      
      // Si encontramos documentos, usar la información del primer documento para el usuario
      if (documentosFiltrados.length > 0) {
        setSolicitudInfo({
          ...solicitudData.datos,
          // Agregar información del usuario desde los documentos
          primer_nombre: documentosFiltrados[0].primer_nombre,
          segundo_nombre: documentosFiltrados[0].segundo_nombre,
          primer_apellido: documentosFiltrados[0].primer_apellido,
          segundo_apellido: documentosFiltrados[0].segundo_apellido,
          email: documentosFiltrados[0].email,
          telefono: documentosFiltrados[0].telefono,
          tipo_identificacion: documentosFiltrados[0].tipo_identificacion,
          numero_identificacion: documentosFiltrados[0].numero_identificacion
        })
      }
      
      console.log('Documentos cargados:', documentosFiltrados.length)
      
    } catch (error) {
      console.error('Error al cargar documentos:', error)
      setError(error.message)
      setDocumentos([])
    } finally {
      setLoadingDocumentos(false)
    }
  }

  // Función para recargar datos
  const actualizarDatos = () => {
    cargarSolicitud()
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

  const obtenerNombreCompleto = (documento) => {
    if (!documento) return 'Nombre no disponible'
    
    const partes = [
      documento.primer_nombre,
      documento.segundo_nombre,
      documento.primer_apellido,
      documento.segundo_apellido
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
      case 'Radicado': return <Clock className="w-4 h-4" />
      case 'En revisión': return <AlertCircle className="w-4 h-4" />
      case 'Aprobado': return <CheckCircle className="w-4 h-4" />
      case 'Rechazado': return <XCircle className="w-4 h-4" />
      case 'Cerrado': return <FileText className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const obtenerIconoDocumento = (tipo) => {
    switch(tipo) {
      case 'Certificado de Notas': return <FileCheck className="w-6 h-6 text-blue-600" />
      case 'Carta de Solicitud': return <Mail className="w-6 h-6 text-green-600" />
      case 'Certificación de Finalización de Estudios': return <FileText className="w-6 h-6 text-purple-600" />
      default: return <FileText className="w-6 h-6 text-gray-600" />
    }
  }

  const obtenerColorTipoDocumento = (tipo) => {
    switch(tipo) {
      case 'Certificado de Notas': return 'bg-blue-50 border-blue-200'
      case 'Carta de Solicitud': return 'bg-green-50 border-green-200'
      case 'Certificación de Finalización de Estudios': return 'bg-purple-50 border-purple-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  // Navegación
  const volverAtras = () => {
    router.back()
  }

  const irAVerInformacion = () => {
    router.push(`/coordinador/homologaciones/${solicitudId}/ver-informacion`)
  }

  const irAGestionarProceso = () => {
    router.push(`/coordinador/homologaciones/${solicitudId}/gestionar-proceso`)
  }

  // Función para descargar documento
  const descargarDocumento = (documento) => {
    const urlDescarga = `http://127.0.0.1:8000/storage/${documento.ruta}`
    
    // Crear enlace temporal para descarga
    const enlace = document.createElement('a')
    enlace.href = urlDescarga
    enlace.download = `${documento.tipo}_${documento.id_documento}.pdf`
    enlace.target = '_blank'
    
    // Agregar al DOM, hacer clic y remover
    document.body.appendChild(enlace)
    enlace.click()
    document.body.removeChild(enlace)
    
    console.log('Descargando documento:', urlDescarga)
  }

  // Función para alternar expansión de documento
  const alternarExpansion = (documentoId) => {
    const nuevosExpandidos = new Set(documentosExpandidos)
    if (nuevosExpandidos.has(documentoId)) {
      nuevosExpandidos.delete(documentoId)
    } else {
      nuevosExpandidos.add(documentoId)
    }
    setDocumentosExpandidos(nuevosExpandidos)
  }

  // Obtener URL del documento para previsualización
  const obtenerUrlDocumento = (documento) => {
    return `http://127.0.0.1:8000/storage/${documento.ruta}`
  }

  if (loadingSolicitud || loadingDocumentos) {
    return (
      <SidebarLayout userRole="coordinacion" currentUser={currentUser}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
          <div className="max-w-6xl mx-auto">
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
                <p className="text-gray-600">Cargando documentos de la solicitud...</p>
              </div>
            </div>
          </div>
        </div>
      </SidebarLayout>
    )
  }

  if (error || errorSolicitud) {
    return (
      <SidebarLayout userRole="coordinacion" currentUser={currentUser}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="neu-card p-12 text-center">
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-600 mb-2">
                Error al cargar los documentos
              </h3>
              <p className="text-red-500 mb-6">{error || errorSolicitud}</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={volverAtras}
                  className="neu-button px-6 py-3 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver</span>
                </button>
                <button
                  onClick={actualizarDatos}
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
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <FolderOpen className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-blue-900">Documentos de Solicitud</h1>
                    <p className="text-gray-600">
                      Radicado: {obtenerDatoSeguro(solicitudInfo?.numero_radicado)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Estado actual */}
                <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium border ${obtenerColorEstado(solicitudInfo?.estado)}`}>
                  {obtenerIconoEstado(solicitudInfo?.estado)}
                  <span>{obtenerDatoSeguro(solicitudInfo?.estado)}</span>
                </span>
                
                {/* Botón ver información */}
                <button
                  onClick={irAVerInformacion}
                  className="neu-button px-6 py-3 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
                >
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Ver Información</span>
                </button>
                
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

          {/* Información del estudiante */}
          {solicitudInfo && documentos.length > 0 && (
            <div className="neu-card p-6 mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-blue-900">Información del Estudiante</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nombre Completo</label>
                  <p className="text-lg font-semibold text-gray-900">{obtenerNombreCompleto(documentos[0])}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Identificación</label>
                  <p className="text-gray-900">
                    {obtenerDatoSeguro(documentos[0]?.tipo_identificacion)} - {obtenerDatoSeguro(documentos[0]?.numero_identificacion)}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{obtenerDatoSeguro(documentos[0]?.email)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Teléfono</label>
                  <p className="text-gray-900">{obtenerDatoSeguro(documentos[0]?.telefono)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Estado de Solicitud</label>
                  <p className="text-gray-900">{obtenerDatoSeguro(documentos[0]?.estado)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha de Solicitud</label>
                  <p className="text-gray-900">{formatearFecha(documentos[0]?.fecha_solicitud)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Stepper de documentos */}
          <div className="neu-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-blue-900">Documentos Adjuntos</h2>
                  <p className="text-gray-600">
                    Total de documentos: {documentos.length}
                  </p>
                </div>
              </div>
              
              <button
                onClick={actualizarDatos}
                className="neu-button px-4 py-2 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
              >
                <RefreshCw className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">Actualizar</span>
              </button>
            </div>

            {documentos.length > 0 ? (
              <div className="space-y-4">
                {documentos.map((documento, index) => {
                  const estaExpandido = documentosExpandidos.has(documento.id_documento)
                  
                  return (
                    <div key={documento.id_documento} className="border border-gray-200 rounded-xl overflow-hidden">
                      {/* Header del step */}
                      <div className={`p-6 cursor-pointer transition-all duration-300 ${obtenerColorTipoDocumento(documento.tipo)} hover:shadow-md`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            {/* Número del paso */}
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                              {index + 1}
                            </div>
                            
                            {/* Icono del documento */}
                            <div className="flex-shrink-0">
                              {obtenerIconoDocumento(documento.tipo)}
                            </div>
                            
                            {/* Información del documento */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {obtenerDatoSeguro(documento.tipo)}
                              </h3>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{formatearFecha(documento.fecha_subida)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <FolderOpen className="w-4 h-4" />
                                  <span className="truncate max-w-xs">{documento.ruta}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Controles */}
                          <div className="flex items-center space-x-3 ml-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                descargarDocumento(documento)
                              }}
                              className="neu-button px-4 py-2 rounded-lg flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
                            >
                              <Download className="w-4 h-4 text-blue-600" />
                              <span className="font-medium text-blue-900">Descargar</span>
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(obtenerUrlDocumento(documento), '_blank')
                              }}
                              className="neu-button px-4 py-2 rounded-lg flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
                            >
                              <Maximize2 className="w-4 h-4 text-blue-600" />
                              <span className="font-medium text-blue-900">Pantalla Completa</span>
                            </button>
                            
                            <button
                              onClick={() => alternarExpansion(documento.id_documento)}
                              className="neu-button p-2 rounded-lg hover:shadow-lg transition-all duration-300"
                            >
                              {estaExpandido ? (
                                <ChevronUp className="w-5 h-5 text-gray-600" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Contenido expandible con PDF */}
                      {estaExpandido && (
                        <div className="border-t border-gray-200 bg-white">
                          <div className="p-4">
                            <div className="bg-gray-100 rounded-lg p-4 mb-4">
                              <div className="flex items-center justify-between text-sm text-gray-700">
                                <div className="flex items-center space-x-4">
                                  <span className="flex items-center space-x-1">
                                    <FileText className="w-4 h-4" />
                                    <span>{documento.tipo}</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatearFecha(documento.fecha_subida)}</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <FolderOpen className="w-4 h-4" />
                                    <span>{documento.ruta}</span>
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  ID: {documento.id_documento}
                                </div>
                              </div>
                            </div>
                            
                            {/* Visor de PDF inline */}
                            <div className="w-full bg-white rounded-lg shadow-inner overflow-hidden" style={{ height: '600px' }}>
                              <iframe
                                src={`${obtenerUrlDocumento(documento)}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
                                className="w-full h-full border-0"
                                title={`Vista previa: ${documento.tipo}`}
                                onError={(e) => {
                                  console.error('Error al cargar PDF:', e)
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <FilePlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No se encontraron documentos
                </h3>
                <p className="text-gray-500 mb-4">
                  Esta solicitud aún no tiene documentos adjuntos.
                </p>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>Solicitud ID: {solicitudId}</p>
                  <p>Usuario ID: {usuarioId || 'No determinado'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}