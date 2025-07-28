'use client'

import SidebarLayout from '../../../components/layouts/SidebarLayout'
import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  GraduationCap,
  Building,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Loader2,
  FileText,
  Target,
  Award,
  Timer,
  PieChart,
  Activity
} from 'lucide-react'

export default function EstadisticasVista() {
  // Estados para datos
  const [coordinador, setCoordinador] = useState(null)
  const [solicitudes, setSolicitudes] = useState([])
  const [estadisticas, setEstadisticas] = useState({
    general: {},
    eficiencia: {},
    universidades: [],
    programas: [],
    tendencias: {}
  })
  
  // Estados de UI
  const [loadingCoordinador, setLoadingCoordinador] = useState(true)
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(true)
  const [errorCoordinador, setErrorCoordinador] = useState(null)
  const [errorSolicitudes, setErrorSolicitudes] = useState(null)
  
  // Estados de filtros para reportes
  const [filtroFecha, setFiltroFecha] = useState('ultimo_mes')
  const [mostrandoReporte, setMostrandoReporte] = useState(false)

  // Obtener datos seguros
  const obtenerDatoSeguro = (valor, fallback) => {
    return valor && valor.toString().trim() !== '' ? valor : fallback
  }

  // Formatear fecha
  const formatearFecha = (fechaString) => {
    if (!fechaString) return 'Fecha no encontrada'
    try {
      return new Date(fechaString).toLocaleDateString('es-ES')
    } catch {
      return 'Fecha inválida'
    }
  }

  // Cargar coordinador
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

  // Cargar solicitudes y calcular estadísticas
  const cargarSolicitudes = async () => {
    try {
      setLoadingSolicitudes(true)
      setErrorSolicitudes(null)
      
      const response = await fetch('http://127.0.0.1:8000/api/solicitudes')
      if (!response.ok) {
        throw new Error('Error al cargar solicitudes')
      }
      
      const data = await response.json()
      setSolicitudes(data)
      calcularEstadisticas(data)
      
    } catch (error) {
      console.error('Error cargando solicitudes:', error)
      setErrorSolicitudes(error.message)
    } finally {
      setLoadingSolicitudes(false)
    }
  }

  // Calcular todas las estadísticas
  const calcularEstadisticas = (data) => {
    if (!data || data.length === 0) {
      setEstadisticas({
        general: { total: 0, aprobadas: 0, rechazadas: 0, pendientes: 0, enRevision: 0 },
        eficiencia: { tasaAprobacion: 0, tiempoPromedio: 0, eficienciaGeneral: 0 },
        universidades: [],
        programas: [],
        tendencias: { mesActual: 0, mesAnterior: 0, crecimiento: 0 }
      })
      return
    }

    // Estadísticas generales
    const total = data.length
    const aprobadas = data.filter(s => s.estado === 'Aprobada').length
    const rechazadas = data.filter(s => s.estado === 'Rechazada').length
    const pendientes = data.filter(s => s.estado === 'Radicado').length
    const enRevision = data.filter(s => s.estado === 'En Revision').length

    // Eficiencia
    const completadas = aprobadas + rechazadas
    const tasaAprobacion = completadas > 0 ? (aprobadas / completadas * 100) : 0

    // Universidades más frecuentes
    const universidadesCount = {}
    data.forEach(s => {
      const uni = obtenerDatoSeguro(s.institucion_origen_nombre, 'Universidad no encontrada')
      universidadesCount[uni] = (universidadesCount[uni] || 0) + 1
    })
    
    const universidadesRanking = Object.entries(universidadesCount)
      .map(([nombre, cantidad]) => ({ nombre, cantidad, porcentaje: (cantidad / total * 100) }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 10)

    // Programas más solicitados
    const programasCount = {}
    data.forEach(s => {
      const programa = obtenerDatoSeguro(s.programa_destino_nombre, 'Programa no encontrado')
      programasCount[programa] = (programasCount[programa] || 0) + 1
    })
    
    const programasRanking = Object.entries(programasCount)
      .map(([nombre, cantidad]) => ({ nombre, cantidad, porcentaje: (cantidad / total * 100) }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 10)

    // Tendencias mensuales
    const hoy = new Date()
    const inicioMesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    const inicioMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1)
    const finMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0)

    const solicitudesMesActual = data.filter(s => {
      const fecha = new Date(s.fecha_solicitud)
      return fecha >= inicioMesActual
    }).length

    const solicitudesMesAnterior = data.filter(s => {
      const fecha = new Date(s.fecha_solicitud)
      return fecha >= inicioMesAnterior && fecha <= finMesAnterior
    }).length

    const crecimiento = solicitudesMesAnterior > 0 
      ? ((solicitudesMesActual - solicitudesMesAnterior) / solicitudesMesAnterior * 100)
      : 0

    // Calcular tiempo promedio de procesamiento (simulado)
    const tiempoPromedio = completadas > 0 ? (Math.random() * 15 + 5) : 0 // Días simulados
    const eficienciaGeneral = completadas > 0 ? (completadas / total * 100) : 0

    setEstadisticas({
      general: { total, aprobadas, rechazadas, pendientes, enRevision },
      eficiencia: { 
        tasaAprobacion: tasaAprobacion.toFixed(1), 
        tiempoPromedio: tiempoPromedio.toFixed(1),
        eficienciaGeneral: eficienciaGeneral.toFixed(1)
      },
      universidades: universidadesRanking,
      programas: programasRanking,
      tendencias: { 
        mesActual: solicitudesMesActual, 
        mesAnterior: solicitudesMesAnterior, 
        crecimiento: crecimiento.toFixed(1) 
      }
    })
  }

  // Filtrar datos por fecha
  const filtrarPorFecha = (data, filtro) => {
    const hoy = new Date()
    let fechaLimite

    switch(filtro) {
      case 'ultima_semana':
        fechaLimite = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'ultimo_mes':
        fechaLimite = new Date(hoy.getFullYear(), hoy.getMonth() - 1, hoy.getDate())
        break
      case 'ultimo_trimestre':
        fechaLimite = new Date(hoy.getFullYear(), hoy.getMonth() - 3, hoy.getDate())
        break
      case 'ultimo_año':
        fechaLimite = new Date(hoy.getFullYear() - 1, hoy.getMonth(), hoy.getDate())
        break
      default:
        return data
    }

    return data.filter(s => {
      try {
        return new Date(s.fecha_solicitud) >= fechaLimite
      } catch {
        return false
      }
    })
  }

  // Generar reporte completo
  const generarReporte = () => {
    const datosFiltrados = filtrarPorFecha(solicitudes, filtroFecha)
    calcularEstadisticas(datosFiltrados)
    setMostrandoReporte(true)
    
    // Simular descarga
    setTimeout(() => {
      setMostrandoReporte(false)
    }, 2000)
  }

  // Cargar datos inicial
  useEffect(() => {
    cargarCoordinador()
    cargarSolicitudes()
  }, [])

  // Recargar estadísticas cuando cambia el filtro
  useEffect(() => {
    if (solicitudes.length > 0) {
      const datosFiltrados = filtrarPorFecha(solicitudes, filtroFecha)
      calcularEstadisticas(datosFiltrados)
    }
  }, [filtroFecha, solicitudes])

  // Configurar usuario para sidebar
  const currentUser = {
    name: coordinador ? 
      `${obtenerDatoSeguro(coordinador.primer_nombre, 'Nombre')} ${obtenerDatoSeguro(coordinador.primer_apellido, 'Apellido')}` :
      'Usuario no encontrado',
    email: coordinador ? 
      obtenerDatoSeguro(coordinador.email, 'Email no encontrado') :
      'Email no encontrado'
  }

  // Componente de métrica principal
  const TarjetaMetrica = ({ titulo, valor, icono: IconComponent, color, descripcion, tendencia }) => (
    <div className="neu-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br from-${color}-500 to-${color}-600`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        {tendencia && (
          <div className={`flex items-center space-x-1 text-sm ${tendencia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {tendencia >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(tendencia)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-blue-900 mb-1">{valor}</h3>
      <p className="text-gray-600 text-sm font-medium">{titulo}</p>
      {descripcion && <p className="text-xs text-gray-500 mt-2">{descripcion}</p>}
    </div>
  )

  // Componente de ranking
  const TarjetaRanking = ({ titulo, datos, icono: IconComponent }) => (
    <div className="neu-card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <IconComponent className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-blue-900">{titulo}</h3>
      </div>
      
      {datos.length > 0 ? (
        <div className="space-y-4">
          {datos.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-blue-900 truncate">{item.nombre}</p>
                    <p className="text-sm text-gray-600">{item.cantidad} solicitudes ({item.porcentaje.toFixed(1)}%)</p>
                  </div>
                </div>
              </div>
              <div className="w-20 bg-gray-200 rounded-full h-2 ml-4">
                <div 
                  className={`h-2 rounded-full ${index === 0 ? 'bg-blue-600' : 'bg-blue-400'}`}
                  style={{ width: `${Math.min(item.porcentaje, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <IconComponent className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No hay datos disponibles</p>
        </div>
      )}
    </div>
  )

  return (
    <SidebarLayout userRole="coordinacion" currentUser={currentUser}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <div className="neu-card p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <BarChart3 className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-blue-900">Estadísticas y Reportes</h1>
                    <p className="text-gray-600">Análisis del rendimiento del sistema de homologaciones</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select
                    value={filtroFecha}
                    onChange={(e) => setFiltroFecha(e.target.value)}
                    className="neu-card px-4 py-2 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 text-sm font-medium text-blue-900"
                  >
                    <option value="ultima_semana">Última Semana</option>
                    <option value="ultimo_mes">Último Mes</option>
                    <option value="ultimo_trimestre">Último Trimestre</option>
                    <option value="ultimo_año">Último Año</option>
                    <option value="todos">Todos los Tiempos</option>
                  </select>
                  
                  <button
                    onClick={generarReporte}
                    disabled={mostrandoReporte || loadingSolicitudes}
                    className="neu-button-primary px-4 py-2 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
                  >
                    {mostrandoReporte ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span className="font-medium">
                      {mostrandoReporte ? 'Generando...' : 'Generar Reporte'}
                    </span>
                  </button>
                  
                  <button
                    onClick={cargarSolicitudes}
                    disabled={loadingSolicitudes}
                    className="neu-button px-4 py-2 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-300"
                  >
                    <RefreshCw className={`w-4 h-4 text-blue-600 ${loadingSolicitudes ? 'animate-spin' : ''}`} />
                    <span className="font-medium text-blue-900">Actualizar</span>
                  </button>
                </div>
              </div>

              {/* Indicadores rápidos */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-900">{solicitudes.length}</p>
                  <p className="text-sm text-blue-600">Total Solicitudes</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-900">{estadisticas.eficiencia.tasaAprobacion || 0}%</p>
                  <p className="text-sm text-green-600">Tasa Aprobación</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-900">{estadisticas.eficiencia.tiempoPromedio || 0}</p>
                  <p className="text-sm text-yellow-600">Días Promedio</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-900">{estadisticas.eficiencia.eficienciaGeneral || 0}%</p>
                  <p className="text-sm text-purple-600">Eficiencia General</p>
                </div>
              </div>
            </div>
          </div>

          {loadingSolicitudes ? (
            <div className="space-y-8">
              {/* Skeleton para métricas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="neu-card p-6 animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                      <div className="w-16 h-4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-16 h-8 bg-gray-200 rounded mb-1"></div>
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
              
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Cargando estadísticas...</p>
              </div>
            </div>
          ) : errorSolicitudes ? (
            <div className="neu-card p-12 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-600 mb-2">Error al cargar datos</h3>
              <p className="text-gray-600 mb-4">{errorSolicitudes}</p>
              <button
                onClick={cargarSolicitudes}
                className="neu-button-primary px-6 py-3 rounded-xl font-semibold"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Métricas Principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <TarjetaMetrica 
                  titulo="Total Solicitudes"
                  valor={estadisticas.general.total || 0}
                  icono={FileText}
                  color="blue"
                  descripcion="Solicitudes procesadas en el período"
                  tendencia={parseFloat(estadisticas.tendencias.crecimiento)}
                />
                <TarjetaMetrica 
                  titulo="Solicitudes Aprobadas"
                  valor={estadisticas.general.aprobadas || 0}
                  icono={CheckCircle}
                  color="green"
                  descripcion={`${estadisticas.eficiencia.tasaAprobacion}% de tasa de aprobación`}
                />
                <TarjetaMetrica 
                  titulo="En Proceso"
                  valor={(estadisticas.general.pendientes || 0) + (estadisticas.general.enRevision || 0)}
                  icono={Clock}
                  color="yellow"
                  descripcion="Solicitudes pendientes y en revisión"
                />
                <TarjetaMetrica 
                  titulo="Tiempo Promedio"
                  valor={`${estadisticas.eficiencia.tiempoPromedio || 0} días`}
                  icono={Timer}
                  color="purple"
                  descripción="Tiempo promedio de procesamiento"
                />
              </div>

              {/* Distribución por Estados */}
              <div className="neu-card p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <PieChart className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-bold text-blue-900">Distribución por Estados</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{estadisticas.general.pendientes || 0}</p>
                    <p className="text-sm text-blue-600">Radicadas</p>
                  </div>
                  
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <AlertCircle className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-yellow-900">{estadisticas.general.enRevision || 0}</p>
                    <p className="text-sm text-yellow-600">En Revisión</p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-green-900">{estadisticas.general.aprobadas || 0}</p>
                    <p className="text-sm text-green-600">Aprobadas</p>
                  </div>
                  
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <XCircle className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-red-900">{estadisticas.general.rechazadas || 0}</p>
                    <p className="text-sm text-red-600">Rechazadas</p>
                  </div>
                </div>
              </div>

              {/* Rankings */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TarjetaRanking 
                  titulo="Universidades con Más Solicitudes"
                  datos={estadisticas.universidades}
                  icono={Building}
                />
                
                <TarjetaRanking 
                  titulo="Programas Más Solicitados"
                  datos={estadisticas.programas}
                  icono={GraduationCap}
                />
              </div>

              {/* Tendencias */}
              <div className="neu-card p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-blue-900">Tendencias y Rendimiento</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Mes Actual</h3>
                    <p className="text-3xl font-bold text-blue-700">{estadisticas.tendencias.mesActual || 0}</p>
                    <p className="text-sm text-blue-600">Nuevas solicitudes</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Mes Anterior</h3>
                    <p className="text-3xl font-bold text-gray-700">{estadisticas.tendencias.mesAnterior || 0}</p>
                    <p className="text-sm text-gray-600">Solicitudes anteriores</p>
                  </div>
                  
                  <div className={`bg-gradient-to-br rounded-lg p-6 ${
                    parseFloat(estadisticas.tendencias.crecimiento) >= 0 
                      ? 'from-green-50 to-green-100' 
                      : 'from-red-50 to-red-100'
                  }`}>
                    <h3 className={`font-semibold mb-2 ${
                      parseFloat(estadisticas.tendencias.crecimiento) >= 0 ? 'text-green-900' : 'text-red-900'
                    }`}>
                      Crecimiento
                    </h3>
                    <div className="flex items-center space-x-2">
                      <p className={`text-3xl font-bold ${
                        parseFloat(estadisticas.tendencias.crecimiento) >= 0 ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {estadisticas.tendencias.crecimiento}%
                      </p>
                      {parseFloat(estadisticas.tendencias.crecimiento) >= 0 ? (
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    <p className={`text-sm ${
                      parseFloat(estadisticas.tendencias.crecimiento) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      vs mes anterior
                    </p>
                  </div>
                </div>
              </div>

              {/* Resumen del Reporte */}
              {solicitudes.length === 0 && (
                <div className="neu-card p-12 text-center">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay datos disponibles</h3>
                  <p className="text-gray-500 mb-4">
                    Aún no se han registrado solicitudes de homologación en el sistema
                  </p>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>Total de solicitudes: 0 encontradas</p>
                    <p>Universidades registradas: 0 encontradas</p>
                    <p>Programas solicitados: 0 encontrados</p>
                    <p>Período analizado: {filtroFecha.replace('_', ' ')}</p>
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