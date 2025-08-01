"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  FileText, 
  Settings, 
  LogOut, 
  BarChart3, 
  Building, 
  Menu, 
  ChevronDown,
  User
} from 'lucide-react';

// Configuración de menús por rol
const menuConfig = {
  coordinacion: {
    title: "Coordinación Académica",
    avatar: "CA",
    items: [
      { id: 'inicio', label: 'Inicio', icon: Home, path: '/coordinador' },
      { id: 'homologaciones', label: 'Homologaciones', icon: FileText, path: '/coordinador/homologaciones' },
      { id: 'estadisticas', label: 'Estadísticas', icon: BarChart3, path: '/coordinador/estadisticas' },
      { id: 'instituciones', label: 'Instituciones', icon: Building, path: '/coordinador/instituciones' },
      { id: 'configuracion', label: 'Configuración', icon: Settings, path: '/coordinador/configuracion' },
      { id: 'cerrar-sesion', label: 'Cerrar Sesión', icon: LogOut, path: '/logout', isLogout: true }
    ]
  },
  estudiante: {
    title: "Portal Estudiante",
    avatar: "ES",
    items: [
      { id: 'inicio', label: 'Inicio', icon: Home, path: '/estudiante' },
      { id: 'mis-homologaciones', label: 'Mis Homologaciones', icon: FileText, path: '/estudiante/mis-homologaciones' },
      { id: 'nueva-solicitud', label: 'Nueva Solicitud', icon: FileText, path: '/estudiante/nueva-solicitud' },
      { id: 'perfil', label: 'Mi Perfil', icon: User, path: '/estudiante/perfil' },
      { id: 'cerrar-sesion', label: 'Cerrar Sesión', icon: LogOut, path: '/logout', isLogout: true }
    ]
  },
  admin: {
    title: "Administrador",
    avatar: "AD",
    items: [
      { id: 'inicio', label: 'Dashboard', icon: Home, path: '/admin' },
      { id: 'homologaciones', label: 'Todas las Homologaciones', icon: FileText, path: '/admin/homologaciones' },
      { id: 'estadisticas', label: 'Estadísticas Generales', icon: BarChart3, path: '/admin/estadisticas' },
      { id: 'instituciones', label: 'Gestión Instituciones', icon: Building, path: '/admin/instituciones' },
      { id: 'usuarios', label: 'Gestión Usuarios', icon: User, path: '/admin/usuarios' },
      { id: 'configuracion', label: 'Configuración Sistema', icon: Settings, path: '/admin/configuracion' },
      { id: 'cerrar-sesion', label: 'Cerrar Sesión', icon: LogOut, path: '/logout', isLogout: true }
    ]
  }
};

// Componente del Layout Principal
export default function SidebarLayout({ children, userRole = 'coordinacion', currentUser = { name: 'Usuario', email: 'usuario@universidad.edu' } }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('inicio');

  const currentMenu = menuConfig[userRole] || menuConfig.coordinacion;

  // Determinar el elemento activo basado en la ruta actual
  useEffect(() => {
    const currentItem = currentMenu.items.find(item => {
      if (item.path === pathname) return true;
      if (item.path !== '/' && pathname.startsWith(item.path)) return true;
      return false;
    });
    
    if (currentItem) {
      setActiveItem(currentItem.id);
    }
  }, [pathname, currentMenu.items]);

  const handleMenuClick = (item) => {
    if (item.isLogout) {
      handleLogout();
      return;
    }
    
    // Navegar a la ruta
    router.push(item.path);
    setActiveItem(item.id);
    setMobileMenuOpen(false); // Cerrar menú móvil al hacer click
  };

  const handleLogout = () => {
    // Aquí puedes agregar la lógica de logout
    console.log('Cerrando sesión...');
    
    // Ejemplo de logout:
    // 1. Limpiar localStorage/sessionStorage
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');
    
    // 2. Limpiar cookies si las usas
    // document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // 3. Redirigir al login
    router.push('/login');
    
    // 4. Si usas algún estado global (Context, Redux), limpiarlo también
  };

  const handleUserMenuAction = (action) => {
    setUserMenuOpen(false);
    
    switch (action) {
      case 'profile':
        router.push(`/${userRole}/perfil`);
        break;
      case 'change-password':
        router.push(`/${userRole}/cambiar-contrasena`);
        break;
      default:
        break;
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Overlay para móvil */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}
        w-72
      `}>
        <div className="neu-card h-full rounded-none lg:rounded-r-2xl border-r border-gray-200 overflow-hidden">
          {/* Header del Sidebar */}
          <div className={`p-4 border-b border-gray-200 transition-all duration-300 ${sidebarCollapsed ? 'lg:px-3' : ''}`}>
            <div className="flex items-center justify-between">
              <div className={`flex items-center transition-all duration-300 ${sidebarCollapsed ? 'lg:w-0 lg:opacity-0' : 'space-x-2'}`}>
                {/* Mostrar título solo cuando está desplegado */}
                {!sidebarCollapsed && (
                  <div className="transition-all duration-300">
                    <h2 className="text-azul-oscuro font-semibold text-xs whitespace-nowrap">{currentMenu.title}</h2>
                    <p className="text-gray-500 text-xs whitespace-nowrap">Sistema Homologaciones</p>
                  </div>
                )}
              </div>
              
              {/* Botón de menú dentro del sidebar - siempre visible */}
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                    toggleMobileMenu();
                  } else {
                    toggleSidebar();
                  }
                }}
                className={`neu-button p-1 flex-shrink-0 ${sidebarCollapsed ? 'lg:mx-auto' : ''}`}
                title={sidebarCollapsed ? "Expandir menú" : "Contraer menú"}
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navegación */}
          <nav className={`flex-1 p-4 space-y-2 transition-all duration-300 ${sidebarCollapsed ? 'lg:px-2' : ''}`}>
            {currentMenu.items.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeItem === item.id;
              const isLogout = item.isLogout;
              
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => handleMenuClick(item)}
                    className={`
                      w-full flex items-center rounded-xl transition-all duration-300 ease-in-out relative overflow-hidden
                      ${sidebarCollapsed ? 'lg:justify-center lg:px-2 lg:py-3' : 'space-x-3 px-4 py-3'}
                      ${isActive 
                        ? 'bg-azul-medio text-white shadow-lg' 
                        : isLogout
                          ? 'neu-button hover:bg-red-50 hover:text-rojo-error'
                          : 'neu-button hover:shadow-neu-hover'
                      }
                    `}
                  >
                    <IconComponent className={`w-4 h-4 flex-shrink-0 transition-colors duration-300 ${isActive ? 'text-white' : isLogout ? 'text-rojo-error' : 'text-azul-medio'}`} />
                    <span className={`
                      font-medium whitespace-nowrap transition-all duration-300 overflow-hidden text-sm
                      ${sidebarCollapsed ? 'lg:w-0 lg:opacity-0' : 'w-auto opacity-100'}
                      ${isActive ? 'text-white' : isLogout ? 'text-rojo-error' : 'text-azul-oscuro'}
                    `}>
                      {item.label}
                    </span>
                  </button>
                  
                  {/* Tooltip para sidebar colapsado */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap hidden lg:block">
                      {item.label}
                      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-1 h-1 bg-gray-900 rotate-45"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Usuario Info */}
          <div className={`p-3 border-t border-gray-200 transition-all duration-300 ${sidebarCollapsed ? 'lg:px-2' : ''}`}>
            <div className="relative">
              {/* Mostrar solo el icono cuando está colapsado */}
              {sidebarCollapsed ? (
                <button 
                  onClick={() => handleUserMenuAction('profile')}
                  className="neu-button w-full flex items-center justify-center px-2 py-2"
                  title="Ver perfil"
                >
                  <div className="w-6 h-6 bg-azul-claro bg-opacity-20 rounded-lg flex items-center justify-center">
                    <User className="w-3 h-3 text-azul-medio" />
                  </div>
                </button>
              ) : (
                /* Mostrar información completa cuando está desplegado */
                <>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="neu-button w-full flex items-center space-x-2 px-3 py-2"
                  >
                    <div className="w-6 h-6 bg-azul-claro bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-3 h-3 text-azul-medio" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-azul-oscuro font-medium text-xs whitespace-nowrap">{currentUser.name}</p>
                      <p className="text-gray-500 text-xs whitespace-nowrap">{currentUser.email}</p>
                    </div>
                    <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown del usuario - solo cuando está desplegado */}
                  {userMenuOpen && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 neu-card p-2 space-y-1">
                      <button 
                        onClick={() => handleUserMenuAction('profile')}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-azul-claro hover:bg-opacity-10 text-azul-oscuro text-xs"
                      >
                        Ver Perfil
                      </button>
                      <button 
                        onClick={() => handleUserMenuAction('change-password')}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-azul-claro hover:bg-opacity-10 text-azul-oscuro text-xs"
                      >
                        Cambiar Contraseña
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Superior */}
        <header className="neu-card m-2 sm:m-4 mb-0 rounded-2xl p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gradient truncate">
                  Sistema de Homologaciones
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm hidden sm:block">Universidad Autónoma del Cauca</p>
              </div>
            </div>
            
            {/* Indicadores del header - Siempre visibles pero adaptados */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <div className="neu-card px-2 sm:px-3 py-1 sm:py-2 rounded-xl">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-2 h-2 bg-verde-exito rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm text-azul-oscuro font-medium whitespace-nowrap">
                    <span className="hidden sm:inline">Sistema </span>Activo
                  </span>
                </div>
              </div>
              <div className="neu-card px-2 sm:px-3 py-1 sm:py-2 rounded-xl hidden md:block">
                <span className="text-xs sm:text-sm text-azul-oscuro whitespace-nowrap">
                  <span className="font-medium">Rol:</span> <span className="hidden lg:inline">{currentMenu.title}</span><span className="lg:hidden">{currentMenu.avatar}</span>
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Área de Contenido */}
        <main className="flex-1 p-2 sm:p-4 pt-2 sm:pt-4 min-w-0">
          <div className="neu-card rounded-2xl p-3 sm:p-4 lg:p-6 min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}