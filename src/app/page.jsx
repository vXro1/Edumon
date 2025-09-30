'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  Bars3Icon,
  XMarkIcon,
  ClockIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  UserIcon,
  CheckCircleIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChevronDownIcon,
  SparklesIcon,
  RocketLaunchIcon,
  GlobeAltIcon,
  LightBulbIcon,
  StarIcon,
  TrophyIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

// Importación dinámica para evitar problemas con SSR
const MapaInstituciones = dynamic(() => import('./MapaInstituciones'), {
  ssr: false,
  loading: () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Cargando mapa...</p>
    </div>
  )
});

const Homepage = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [instituciones, setInstituciones] = useState([]);
  const [filteredInstituciones, setFilteredInstituciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartamento, setSelectedDepartamento] = useState('');
  const [selectedMunicipio, setSelectedMunicipio] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    fetchInstituciones();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll('[data-animate]');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let filtered = instituciones;

    if (searchTerm) {
      filtered = filtered.filter(inst =>
        inst.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.departamento.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartamento) {
      filtered = filtered.filter(inst => inst.departamento === selectedDepartamento);
    }

    if (selectedMunicipio) {
      filtered = filtered.filter(inst => inst.municipio === selectedMunicipio);
    }

    setFilteredInstituciones(filtered);
  }, [searchTerm, selectedDepartamento, selectedMunicipio, instituciones]);

  const fetchInstituciones = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/instituciones');
      const data = await response.json();
      setInstituciones(data);
      setFilteredInstituciones(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching instituciones:', error);
      setLoading(false);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMenuOpen(false);
    }
  };

  const handleLogin = () => {
    router.push('auth/login');
  };

  const handleRegister = () => {
    router.push('auth/register');
  };

  const handleStartHomologation = () => {
    router.push('/auth/register');
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const getDepartamentos = () => {
    const departamentos = [...new Set(instituciones.map(inst => inst.departamento).filter(dep => dep !== 'Sin departamento'))];
    return departamentos.sort();
  };

  const getMunicipios = () => {
    let municipios = instituciones;
    if (selectedDepartamento) {
      municipios = municipios.filter(inst => inst.departamento === selectedDepartamento);
    }
    const municipiosList = [...new Set(municipios.map(inst => inst.municipio).filter(mun => mun !== 'Sin municipio'))];
    return municipiosList.sort();
  };

  const getInstitucionesPorDepartamento = () => {
    const grouped = {};
    filteredInstituciones.forEach(inst => {
      const dept = inst.departamento || 'Sin departamento';
      if (!grouped[dept]) {
        grouped[dept] = {};
      }
      const mun = inst.municipio || 'Sin municipio';
      if (!grouped[dept][mun]) {
        grouped[dept][mun] = [];
      }
      grouped[dept][mun].push(inst);
    });
    return grouped;
  };

  const whyUniautonoma = [
    {
      icon: <SparklesIcon className="w-8 h-8" />,
      title: "Proceso Sin Costos Adicionales",
      description: "En la Uniautónoma del Cauca reconocemos tus esfuerzos académicos previos sin cargos extras por homologación.",
      gradient: "from-blue-400 to-blue-600"
    },
    {
      icon: <ClockIcon className="w-8 h-8" />,
      title: "Respuesta en 10-15 Días Hábiles",
      description: "Proceso ágil y eficiente que te permite continuar tus estudios sin perder tiempo valioso.",
      gradient: "from-blue-500 to-blue-700"
    },
    {
      icon: <LightBulbIcon className="w-8 h-8" />,
      title: "Club de Emprendedores",
      description: "Desarrolla competencias estratégicas y liderazgo a través de nuestro Club de Emprendedores y Unidad de Emprendimiento.",
      gradient: "from-blue-400 to-cyan-500"
    },
    {
      icon: <AcademicCapIcon className="w-8 h-8" />,
      title: "Vicerrectoría de Investigaciones",
      description: "Participa en semilleros, grupos de investigación y publicaciones académicas con impacto regional y social.",
      gradient: "from-blue-600 to-blue-800"
    },
    {
      icon: <TrophyIcon className="w-8 h-8" />,
      title: "Formación Integral",
      description: "Experiencia universitaria completa y transformadora que te prepara para el liderazgo y la innovación.",
      gradient: "from-cyan-400 to-blue-600"
    },
    {
      icon: <StarIcon className="w-8 h-8" />,
      title: "Impacto Regional",
      description: "Contribuye a soluciones concretas para la región caucana y genera un impacto real en la sociedad.",
      gradient: "from-blue-500 to-blue-900"
    }
  ];

  const benefits = [
    {
      icon: <ClockIcon className="w-8 h-8" />,
      title: "Ahorro de Tiempo",
      description: "Reduce significativamente el tiempo necesario para completar tu programa académico al validar asignaturas ya cursadas.",
      gradient: "from-blue-400 to-blue-600"
    },
    {
      icon: <CurrencyDollarIcon className="w-8 h-8" />,
      title: "Ahorro Económico",
      description: "Disminuye los costos de tu formación académica al no tener que cursar y pagar nuevamente por asignaturas homologadas.",
      gradient: "from-blue-500 to-blue-700"
    },
    {
      icon: <AcademicCapIcon className="w-8 h-8" />,
      title: "Continuidad Académica",
      description: "No pierdas el avance académico logrado previamente y continúa tu formación de manera fluida.",
      gradient: "from-blue-400 to-cyan-500"
    },
    {
      icon: <DocumentTextIcon className="w-8 h-8" />,
      title: "Proceso Simplificado",
      description: "Sistema digital que facilita el trámite sin necesidad de desplazamientos y con seguimiento en tiempo real.",
      gradient: "from-cyan-400 to-blue-600"
    },
    {
      icon: <UserIcon className="w-8 h-8" />,
      title: "Orientación Personalizada",
      description: "Acompañamiento por parte de asesores académicos durante todo el proceso de homologación.",
      gradient: "from-blue-600 to-blue-800"
    },
    {
      icon: <CheckCircleIcon className="w-8 h-8" />,
      title: "Reconocimiento de Saberes",
      description: "Validación oficial de los conocimientos y competencias adquiridos en otras instituciones educativas.",
      gradient: "from-blue-500 to-blue-900"
    }
  ];

  const faqData = [
    {
      question: "¿Cuánto tiempo toma el proceso de homologación?",
      answer: "El proceso de homologación en la Uniautónoma del Cauca toma entre 10 y 15 días hábiles desde la fecha de solicitud completa, garantizando un proceso ágil y efectivo."
    },
    {
      question: "¿Puedo homologar asignaturas de cualquier institución educativa?",
      answer: "Sí, siempre y cuando la institución de origen esté reconocida por el Ministerio de Educación Nacional o, en caso de instituciones extranjeras, tenga el reconocimiento oficial en su país."
    },
    {
      question: "¿Existe un límite de asignaturas que puedo homologar?",
      answer: "Según el reglamento académico, se puede homologar hasta el 60% de los créditos totales del programa académico al que ingresa."
    },
    {
      question: "¿Qué costo tiene el proceso de homologación?",
      answer: "En la Uniautónoma del Cauca el proceso de homologación no tiene costos adicionales. Reconocemos tus esfuerzos académicos previos sin cargos extras."
    }
  ];

  const FloatingOrbs = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>
      <div className="floating-orb orb-4"></div>
      <div className="floating-orb orb-5"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      <FloatingOrbs />

      {/* Cursor follower */}
      <div
        className="cursor-glow fixed pointer-events-none z-50"
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
        }}
      />
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'neo-header-scrolled' : 'neo-header'
          }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3 group">
              <div className="neo-logo-container">
                <img
                  src="/img/quime.png"
                  alt="Logo Quime"
                  className="w-full h-auto max-w-[8rem] min-w-[6rem]"
                />
              </div>
            </div>

            {/* Navegación en Escritorio */}
            <nav className="hidden lg:flex items-center space-x-6">
              {[
                'inicio',
                'por-que-uniautonoma',
                'proceso',
                'beneficios',
                'requisitos',
                'mapa-universidades',
                'faq',
                'contacto',
              ].map((item, index) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="nav-link-neo"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item === 'por-que-uniautonoma'
                    ? 'Por qué Uniautónoma'
                    : item === 'faq'
                      ? 'Preguntas Frecuentes'
                      : item === 'mapa-universidades'
                        ? 'Convenios'
                        : item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
              <button
                className="btn-neo-primary hidden xl:flex"
                onClick={handleLogin}
              >
                <SparklesIcon className="w-4 h-4 mr-2" />
                Iniciar Sesión
              </button>
            </nav>

            {/* Botón del menú móvil (visible solo <1500px) */}
            <button
              className="block xxl:hidden neo-button-circle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Menú móvil desplegable */}
          {isMenuOpen && (
            <nav className="lg:hidden mt-4 neo-card p-6 rounded-2xl mobile-menu">
              <div className="flex flex-col space-y-4">
                {[
                  'inicio',
                  'por-que-uniautonoma',
                  'proceso',
                  'beneficios',
                  'requisitos',
                  'mapa-universidades',
                  'faq',
                  'contacto',
                ].map((item, index) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className="nav-link-neo text-left"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {item === 'por-que-uniautonoma'
                      ? 'Por qué Uniautónoma'
                      : item === 'faq'
                        ? 'Preguntas Frecuentes'
                        : item === 'mapa-universidades'
                          ? 'Convenios'
                          : item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                ))}
                <button
                  className="btn-neo-primary w-full"
                  onClick={handleLogin}
                >
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  Iniciar Sesión
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>



      {/* Hero Section */}
      <section id="inicio" className="min-h-screen flex items-center justify-center pt-20 px-4 relative">
        <div className="text-center max-w-6xl mx-auto relative z-10">
          <div className="hero-container">

            <h1 className="hero-title">
              Sistema de
              <span className="hero-title-gradient"> Homologación</span>
              <br />
              <span className="hero-title-accent">Académica</span>
            </h1>

            <p className="hero-subtitle">
              Transforma tu futuro académico con tecnología de vanguardia
              <br />
              en la  Autónoma del Cauca
            </p>

          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="hero-bg-elements">
          <div className="bg-element bg-element-1"></div>
          <div className="bg-element bg-element-2"></div>
          <div className="bg-element bg-element-3"></div>
        </div>
      </section>

      {/* Why Uniautónoma Section */}
      <section id="por-que-uniautonoma" className="py-20 px-4 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="main-title">Descubre las razones que nos convierten en tu mejor opción académica</h2>
            <p className="main-subtitle">
              Experiencia, calidad y compromiso con tu futuro profesional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyUniautonoma.map((reason, index) => (
              <div
                key={index}
                className={`benefit-card ${visibleCards.has(`why-${index}`) ? 'animate-in' : ''}`}
                id={`why-${index}`}
                data-animate
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className={`benefit-icon bg-gradient-to-r ${reason.gradient}`}>
                  {reason.icon}
                </div>
                <h3 className="benefit-title">{reason.title}</h3>
                <p className="benefit-description">{reason.description}</p>
                <div className="benefit-shine"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="proceso" className="py-20 px-4 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="main-title">
              Proceso de <span className="text-gradient">Homologación</span>
            </h2>
            <p className="main-subtitle">
              Un proceso intuitivo y eficiente diseñado para tu éxito académico
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                number: "01",
                title: "Registro en el Sistema",
                description: "Complete el formulario de registro para obtener acceso al sistema de homologación.",
                hasButton: true,
                icon: <UserIcon className="w-6 h-6" />,
                color: "blue"
              },
              {
                number: "02",
                title: "Activación de Cuenta",
                description: "Recibirá un correo con sus credenciales de acceso para iniciar sesión.",
                icon: <EnvelopeIcon className="w-6 h-6" />,
                color: "blue"
              },
              {
                number: "03",
                title: "Solicitud de Homologación",
                description: "Complete el formulario de homologación y cargue los documentos requeridos.",
                icon: <DocumentTextIcon className="w-6 h-6" />,
                color: "blue"
              },
              {
                number: "04",
                title: "Revisión Académica",
                description: "El comité académico revisará su solicitud y la documentación presentada.",
                icon: <AcademicCapIcon className="w-6 h-6" />,
                color: "blue"
              },
              {
                number: "05",
                title: "Notificación de Resultados",
                description: "Será notificado sobre la aprobación o rechazo de su solicitud de homologación.",
                icon: <CheckCircleIcon className="w-6 h-6" />,
                color: "blue"
              },
              {
                number: "06",
                title: "Formalización",
                description: "En caso de aprobación, se formalizará el proceso en su registro académico.",
                icon: <SparklesIcon className="w-6 h-6" />,
                color: "blue"
              }
            ].map((step, index) => (
              <div
                key={index}
                className={`process-card process-card-${step.color} ${visibleCards.has(`process-${index}`) ? 'animate-in' : ''}`}
                id={`process-${index}`}
                data-animate
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="process-number">{step.number}</div>
                <div className="process-icon">{step.icon}</div>
                <h3 className="process-title">{step.title}</h3>
                <p className="process-description">{step.description}</p>
                {step.hasButton && (
                  <button
                    className="btn-neo-primary hidden xl:flex"
                    onClick={handleRegister}
                  >
                    <SparklesIcon className="w-4 h-4 mr-2" />
                    Registrate
                  </button>
                )}
                <div className="process-glow"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-20 px-4 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="main-title">
              Beneficios de la <span className="text-gradient">Homologación</span>
            </h2>
            <p className="main-subtitle">
              Descubre las ventajas que transformarán tu experiencia académica
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`benefit-card ${visibleCards.has(`benefit-${index}`) ? 'animate-in' : ''}`}
                id={`benefit-${index}`}
                data-animate
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className={`benefit-icon bg-gradient-to-r ${benefit.gradient}`}>
                  {benefit.icon}
                </div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
                <div className="benefit-shine"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section id="requisitos" className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="main-title">
              Requisitos para la <span className="text-gradient">Homologación</span>
            </h2>
            <p className="main-subtitle">
              Todo lo que necesitas saber para comenzar tu proceso
            </p>
          </div>

          <div className="requirements-container">
            <div className="requirement-section">
              <h3 className="requirement-title">
                <DocumentTextIcon className="w-6 h-6 mr-3" />
                Documentos Generales
              </h3>
              <ul className="requirement-list">
                {[
                  "Documento de identidad vigente (cédula, tarjeta de identidad, pasaporte o cédula de extranjería)",
                  "Certificado de calificaciones oficial de la institución de origen",
                  "Contenido programático o syllabus de cada asignatura a homologar",
                  "Carta de solicitud de homologación, especificando las asignaturas a homologar",
                  "Certificación de finalización de estudios (si aplica)"
                ].map((item, index) => (
                  <li key={index} className="requirement-item">
                    <div className="requirement-bullet"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="requirement-section">
              <h3 className="requirement-title">
                <GlobeAltIcon className="w-6 h-6 mr-3" />
                Documentos Adicionales para Estudiantes Extranjeros
              </h3>
              <ul className="requirement-list">
                {[
                  "Apostilla del certificado de calificaciones",
                  "Copia de la Visa vigente",
                  "Copia del pasaporte"
                ].map((item, index) => (
                  <li key={index} className="requirement-item">
                    <div className="requirement-bullet"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="requirement-section">
              <h3 className="requirement-title">
                <CheckCircleIcon className="w-6 h-6 mr-3" />
                Condiciones para la Homologación
              </h3>
              <ul className="requirement-list">
                {[
                  "Los créditos académicos de la asignatura a homologar deben ser iguales o superiores a los de la asignatura destino",
                  "El contenido programático debe tener al menos un 80% de similitud",
                  "La calificación mínima para considerar la homologación es de 3.5/5.0 o su equivalente",
                  "Solo se homologan asignaturas cursadas en los últimos 5 años",
                  "El máximo de créditos a homologar es el 60% del total del programa destino"
                ].map((item, index) => (
                  <li key={index} className="requirement-item">
                    <div className="requirement-bullet"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mapa de Universidades Section */}
      <section id="mapa-universidades" className="py-20 px-4 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="main-title">
              <span className="text-gradient">Mapa de Convenios</span>
            </h2>
            <p className="main-subtitle">
              Instituciones aliadas para facilitar tu proceso de homologación
            </p>
          </div>

          {/* Filtros */}
          <div className="mb-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar institución..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input-neo pl-10 w-full"
                />
              </div>

              <select
                value={selectedDepartamento}
                onChange={(e) => {
                  setSelectedDepartamento(e.target.value);
                  setSelectedMunicipio('');
                }}
                className="form-input-neo"
              >
                <option value="">Todos los departamentos</option>
                {getDepartamentos().map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              <select
                value={selectedMunicipio}
                onChange={(e) => setSelectedMunicipio(e.target.value)}
                className="form-input-neo"
                disabled={!selectedDepartamento}
              >
                <option value="">Todos los municipios</option>
                {getMunicipios().map(mun => (
                  <option key={mun} value={mun}>{mun}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {loading ? 'Cargando...' : `${filteredInstituciones.length} instituciones encontradas`}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDepartamento('');
                  setSelectedMunicipio('');
                }}
                className="btn-neo-small flex items-center"
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                Limpiar filtros
              </button>
            </div>
          </div>

          {/* Mapa Interactivo */}
          <div className="map-container">
            <div className="map-wrapper">
              <MapaInstituciones
                instituciones={filteredInstituciones}
                loading={loading}
              />
            </div>
          </div>


        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="main-title">
              Preguntas <span className="text-gradient">Frecuentes</span>
            </h2>
            <p className="main-subtitle">
              Resolvemos tus dudas más comunes sobre el proceso
            </p>
          </div>

          <div className="faq-grid">
            {faqData.map((faq, index) => (
              <div key={index} className="faq-card">
                <div className="faq-card-header">
                  <h3 className="faq-card-question">{faq.question}</h3>
                </div>
                <div className="faq-card-body">
                  <p className="faq-card-answer">{faq.answer}</p>
                </div>
                <div className="faq-card-glow"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="main-title">
              <span className="text-gradient">Contáctenos</span>
            </h2>
            <p className="main-subtitle">
              Estamos aquí para apoyarte en cada paso de tu proceso
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              {[
                {
                  icon: <MapPinIcon className="w-6 h-6" />,
                  title: "Dirección",
                  content: ["Calle 5 No. 3-85, Campus Principal", "Popayán, Cauca, Colombia"],
                  color: "blue"
                },
                {
                  icon: <PhoneIcon className="w-6 h-6" />,
                  title: "Teléfonos",
                  content: ["PBX: (602) 8213000", "Oficina de Homologaciones: Ext. 1245"],
                  color: "blue"
                },
                {
                  icon: <EnvelopeIcon className="w-6 h-6" />,
                  title: "Correo Electrónico",
                  content: ["homologaciones@uniautonoma.edu.co", "admisiones@uniautonoma.edu.co"],
                  color: "blue"
                },
                {
                  icon: <ClockIcon className="w-6 h-6" />,
                  title: "Horario de Atención",
                  content: ["Lunes a Viernes: 8:00 AM - 12:00 PM y 2:00 PM - 6:00 PM", "Sábados: 8:00 AM - 12:00 PM"],
                  color: "blue"
                }
              ].map((contact, index) => (
                <div key={index} className={`contact-card contact-card-${contact.color}`}>
                  <div className="contact-icon">{contact.icon}</div>
                  <div className="contact-content">
                    <h4 className="contact-title">{contact.title}</h4>
                    {contact.content.map((line, i) => (
                      <p key={i} className="contact-text">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="contact-form-container">
              <h3 className="contact-form-title">Envíenos un Mensaje</h3>
              <form className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nombre Completo*</label>
                    <input type="text" className="form-input-neo" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Correo Electrónico*</label>
                    <input type="email" className="form-input-neo" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Teléfono</label>
                    <input type="tel" className="form-input-neo" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Asunto*</label>
                    <input type="text" className="form-input-neo" required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Mensaje*</label>
                  <textarea rows={5} className="form-input-neo form-textarea" required></textarea>
                </div>

                <button type="submit" className="btn-neo-primary w-full">
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200">
        <div className="container mx-auto text-center">
          <p className="text-gray-600">© 2025 Autónoma del Cauca - Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        :root {
          --azul-oscuro: #19407b;
          --azul-medio: #0075bf;
          --azul-claro: #08dcff;
          --blanco: #ffffff;
        }
        
        .floating-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(0.0625rem);
          animation: float 20s infinite linear;
        }
        
        .orb-1 {
          width: 18.75rem;
          height: 18.75rem;
          background: linear-gradient(45deg, rgba(25, 64, 123, 0.1), rgba(0, 117, 191, 0.1));
          top: 10%;
          left: -10%;
          animation-delay: -5s;
        }
        
        .orb-2 {
          width: 12.5rem;
          height: 12.5rem;
          background: linear-gradient(45deg, rgba(0, 117, 191, 0.1), rgba(8, 220, 255, 0.1));
          top: 60%;
          right: -5%;
          animation-delay: -10s;
        }
        
        .orb-3 {
          width: 9.375rem;
          height: 9.375rem;
          background: linear-gradient(45deg, rgba(8, 220, 255, 0.1), rgba(25, 64, 123, 0.1));
          bottom: 20%;
          left: 20%;
          animation-delay: -15s;
        }
        
        .orb-4 {
          width: 15.625rem;
          height: 15.625rem;
          background: linear-gradient(45deg, rgba(0, 117, 191, 0.1), rgba(8, 220, 255, 0.1));
          top: 30%;
          right: 30%;
          animation-delay: -8s;
        }
        
        .orb-5 {
          width: 11.25rem;
          height: 11.25rem;
          background: linear-gradient(45deg, rgba(25, 64, 123, 0.1), rgba(0, 117, 191, 0.1));
          bottom: 40%;
          right: 10%;
          animation-delay: -12s;
        }
        
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(1.875rem, -1.875rem) rotate(120deg); }
          66% { transform: translate(-1.25rem, 1.25rem) rotate(240deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        
        .cursor-glow {
          width: 1.25rem;
          height: 1.25rem;
          background: radial-gradient(circle, var(--azul-medio) 0%, transparent 50%);
          border-radius: 50%;
          transition: all 0.1s ease;
          box-shadow: 0 0 1.25rem var(--azul-claro);
        }
        
        .neo-header {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(1.25rem);
          border-bottom: 0.0625rem solid rgba(25, 64, 123, 0.1);
        }
        
        .neo-header-scrolled {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(1.25rem);
          border-bottom: 0.0625rem solid rgba(25, 64, 123, 0.1);
          box-shadow: 0 0.5rem 2rem rgba(25, 64, 123, 0.1);
        }
        
        .neo-logo-container {
          padding: 0.5rem;
          border-radius: 1rem;
          background: linear-gradient(145deg, #ffffff, #f8fafc);
          box-shadow: 
            0.5rem 0.5rem 1rem rgba(25, 64, 123, 0.1),
            -0.5rem -0.5rem 1rem rgba(255, 255, 255, 0.8);
          max-width: 10rem;
        }
        
        .nav-link-neo {
          color: var(--azul-oscuro);
          font-weight: 500;
          padding: 0.75rem 1.25rem;
          border-radius: 0.75rem;
          transition: all 0.3s ease;
          position: relative;
          background: transparent;
          border: none;
          cursor: pointer;
          animation: slideInDown 0.6s ease forwards;
          opacity: 0;
          transform: translateY(-1.25rem);
        }
        
        .nav-link-neo:hover {
          background: linear-gradient(145deg, #f1f5f9, #e2e8f0);
          box-shadow: 
            inset 0.25rem 0.25rem 0.5rem rgba(25, 64, 123, 0.1),
            inset -0.25rem -0.25rem 0.5rem rgba(255, 255, 255, 0.8);
          color: var(--azul-medio);
        }
        
        .btn-neo-primary {
          background: linear-gradient(145deg, var(--azul-medio), var(--azul-oscuro));
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 1rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            0.5rem 0.5rem 1rem rgba(0, 117, 191, 0.2),
            -0.125rem -0.125rem 0.5rem rgba(255, 255, 255, 0.8);
        }
        
        .btn-neo-primary:hover {
          transform: translateY(-0.125rem);
          box-shadow: 
            0.75rem 0.75rem 1.5rem rgba(0, 117, 191, 0.3),
            -0.25rem -0.25rem 0.75rem rgba(255, 255, 255, 0.9);
        }
        
        .btn-neo-small {
          background: linear-gradient(145deg, var(--azul-medio), var(--azul-oscuro));
          color: white;
          padding: 0.625rem 1.25rem;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 
            0.375rem 0.375rem 0.75rem rgba(0, 117, 191, 0.2),
            -0.125rem -0.125rem 0.375rem rgba(255, 255, 255, 0.8);
        }
        
        .btn-neo-small:hover {
          transform: translateY(-0.125rem);
          box-shadow: 
            0.5rem 0.5rem 1rem rgba(0, 117, 191, 0.3),
            -0.25rem -0.25rem 0.5rem rgba(255, 255, 255, 0.9);
        }
        
        .neo-button-circle {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: linear-gradient(145deg, #ffffff, #f8fafc);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--azul-oscuro);
          transition: all 0.3s ease;
          box-shadow: 
            0.375rem 0.375rem 0.75rem rgba(25, 64, 123, 0.1),
            -0.375rem -0.375rem 0.75rem rgba(255, 255, 255, 0.8);
        }
        
        .neo-button-circle:hover {
          transform: scale(1.05);
          box-shadow: 
            0.5rem 0.5rem 1rem rgba(25, 64, 123, 0.15),
            -0.5rem -0.5rem 1rem rgba(255, 255, 255, 0.9);
        }
        
        .neo-card {
          background: linear-gradient(145deg, #ffffff, #f8fafc);
          border-radius: 1.25rem;
          box-shadow: 
            0.75rem 0.75rem 1.5rem rgba(25, 64, 123, 0.1),
            -0.75rem -0.75rem 1.5rem rgba(255, 255, 255, 0.8);
          border: 0.0625rem solid rgba(255, 255, 255, 0.2);
        }
        
        .mobile-menu {
          animation: slideInDown 0.3s ease forwards;
        }
        
        .hero-container {
          animation: heroEntrance 1s ease forwards;
        }
        
        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          color: var(--azul-oscuro);
          margin-bottom: 1.5rem;
          line-height: 1.1;
          animation: titleSlideUp 0.8s ease 0.2s forwards;
          opacity: 0;
          transform: translateY(1.875rem);
          text-shadow: 0 0.25rem 0.5rem rgba(25, 64, 123, 0.1);
        }
        
        .hero-title-gradient {
          background: linear-gradient(45deg, var(--azul-medio), var(--azul-claro), var(--azul-oscuro));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 3s ease-in-out infinite;
        }
        
        .hero-title-accent {
          color: var(--azul-medio);
        }
        
        .hero-subtitle {
          font-size: clamp(1.125rem, 2.5vw, 1.5rem);
          color: #6b7280;
          margin-bottom: 2.5rem;
          line-height: 1.6;
          animation: subtitleFadeIn 0.8s ease 0.4s forwards;
          opacity: 0;
          font-weight: 400;
        }

        .main-title {
          font-size: clamp(2.25rem, 4vw, 3.5rem);
          font-weight: 800;
          color: var(--azul-oscuro);
          margin-bottom: 1.25rem;
          text-align: center;
          line-height: 1.2;
          letter-spacing: -0.02em;
          text-shadow: 0 0.125rem 0.25rem rgba(25, 64, 123, 0.1);
        }
        
        .main-subtitle {
          font-size: clamp(1.125rem, 2vw, 1.375rem);
          color: #64748b;
          text-align: center;
          max-width: 43.75rem;
          margin: 0 auto;
          line-height: 1.6;
          font-weight: 400;
          letter-spacing: 0.01em;
        }
        
        .text-gradient {
          background: linear-gradient(45deg, var(--azul-medio), var(--azul-claro), var(--azul-oscuro));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .process-card {
          background: linear-gradient(145deg, #ffffff, #f8fafc);
          border-radius: 1.5rem;
          padding: 2rem;
          position: relative;
          overflow: hidden;
          transition: all 0.4s ease;
          box-shadow: 
            0.75rem 0.75rem 1.5rem rgba(25, 64, 123, 0.1),
            -0.75rem -0.75rem 1.5rem rgba(255, 255, 255, 0.8);
          opacity: 0;
          transform: translateY(1.875rem);
          border: 0.0625rem solid rgba(255, 255, 255, 0.2);
        }
        
        .process-card.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        .process-card:hover {
          transform: translateY(-0.5rem);
          box-shadow: 
            1.25rem 1.25rem 2.5rem rgba(25, 64, 123, 0.15),
            -1.25rem -1.25rem 2.5rem rgba(255, 255, 255, 0.9);
        }
        
        .process-number {
          position: absolute;
          top: -0.625rem;
          right: -0.625rem;
          width: 3.75rem;
          height: 3.75rem;
          background: linear-gradient(45deg, var(--azul-medio), var(--azul-oscuro));
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.125rem;
          box-shadow: 
            0.5rem 0.5rem 1rem rgba(0, 117, 191, 0.3),
            -0.25rem -0.25rem 0.5rem rgba(255, 255, 255, 0.8);
        }
        
        .process-icon {
          width: 3.5rem;
          height: 3.5rem;
          background: linear-gradient(145deg, rgba(8, 220, 255, 0.1), rgba(0, 117, 191, 0.1));
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--azul-medio);
          margin-bottom: 1.25rem;
          box-shadow: 
            0.375rem 0.375rem 0.75rem rgba(25, 64, 123, 0.1),
            -0.375rem -0.375rem 0.75rem rgba(255, 255, 255, 0.8);
        }
        
        .process-title {
          font-size: clamp(1.25rem, 2vw, 1.5rem);
          font-weight: 700;
          color: var(--azul-oscuro);
          margin-bottom: 0.75rem;
          letter-spacing: -0.01em;
        }
        
        .process-description {
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 1.25rem;
          font-size: 1rem;
        }
        
        .process-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent, rgba(0, 117, 191, 0.05), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        
        .process-card:hover .process-glow {
          opacity: 1;
        }
        
        .benefit-card {
          background: linear-gradient(145deg, #ffffff, #f8fafc);
          border-radius: 1.5rem;
          padding: 2rem;
          position: relative;
          overflow: hidden;
          transition: all 0.4s ease;
          box-shadow: 
            0.75rem 0.75rem 1.5rem rgba(25, 64, 123, 0.1),
            -0.75rem -0.75rem 1.5rem rgba(255, 255, 255, 0.8);
          opacity: 0;
          transform: translateY(1.875rem);
          border: 0.0625rem solid rgba(255, 255, 255, 0.2);
        }
        
        .benefit-card.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        .benefit-card:hover {
          transform: translateY(-0.5rem);
          box-shadow: 
            1.25rem 1.25rem 2.5rem rgba(25, 64, 123, 0.15),
            -1.25rem -1.25rem 2.5rem rgba(255, 255, 255, 0.9);
        }
        
        .benefit-icon {
          width: 4rem;
          height: 4rem;
          border-radius: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 1.25rem;
          box-shadow: 
            0.5rem 0.5rem 1rem rgba(25, 64, 123, 0.1),
            -0.25rem -0.25rem 0.5rem rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
        }
        
        .benefit-card:hover .benefit-icon {
          transform: scale(1.1) rotate(5deg);
        }
        
        .benefit-title {
          font-size: clamp(1.125rem, 2vw, 1.375rem);
          font-weight: 700;
          color: var(--azul-oscuro);
          margin-bottom: 0.75rem;
          letter-spacing: -0.01em;
        }
        
        .benefit-description {
          color: #64748b;
          line-height: 1.6;
          font-size: 1rem;
        }
        
        .benefit-shine {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transform: rotate(45deg);
          transition: all 0.6s ease;
          opacity: 0;
        }
        
        .benefit-card:hover .benefit-shine {
          transform: rotate(45deg) translate(50%, 50%);
          opacity: 1;
        }
        
        .requirements-container {
          background: linear-gradient(145deg, #ffffff, #f8fafc);
          border-radius: 2rem;
          padding: clamp(1.5rem, 3vw, 3rem);
          box-shadow: 
            1.25rem 1.25rem 2.5rem rgba(25, 64, 123, 0.1),
            -1.25rem -1.25rem 2.5rem rgba(255, 255, 255, 0.8);
          border: 0.0625rem solid rgba(255, 255, 255, 0.2);
        }
        
        .requirement-section {
          margin-bottom: 2.5rem;
        }
        
        .requirement-section:last-child {
          margin-bottom: 0;
        }
        
        .requirement-title {
          display: flex;
          align-items: center;
          font-size: clamp(1.375rem, 2.5vw, 1.75rem);
          font-weight: 700;
          color: var(--azul-oscuro);
          margin-bottom: 1.25rem;
          letter-spacing: -0.01em;
        }
        
        .requirement-list {
          list-style: none;
          padding: 0;
        }
        
        .requirement-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 0.75rem;
          padding: 1rem;
          background: linear-gradient(145deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.8));
          border-radius: 1rem;
          transition: all 0.3s ease;
          border: 0.0625rem solid rgba(255, 255, 255, 0.5);
        }
        
        .requirement-item:hover {
          background: linear-gradient(145deg, rgba(0, 117, 191, 0.05), rgba(8, 220, 255, 0.05));
          transform: translateX(0.5rem);
          box-shadow: 
            0.5rem 0.5rem 1rem rgba(25, 64, 123, 0.1),
            -0.25rem -0.25rem 0.5rem rgba(255, 255, 255, 0.8);
        }
        
        .requirement-bullet {
          width: 0.5rem;
          height: 0.5rem;
          background: linear-gradient(45deg, var(--azul-medio), var(--azul-claro));
          border-radius: 50%;
          margin-right: 1rem;
          margin-top: 0.5rem;
          flex-shrink: 0;
          box-shadow: 0 0.125rem 0.25rem rgba(0, 117, 191, 0.3);
        }

        .map-container {
          background: linear-gradient(145deg, #ffffff, #f8fafc);
          border-radius: 2rem;
          padding: 1.25rem;
          box-shadow: 
            1.25rem 1.25rem 2.5rem rgba(25, 64, 123, 0.1),
            -1.25rem -1.25rem 2.5rem rgba(255, 255, 255, 0.8);
          border: 0.0625rem solid rgba(255, 255, 255, 0.2);
          overflow: hidden;
        }

        .map-wrapper {
          width: 100%;
          height: 37.5rem;
          overflow: hidden;
          border-radius: 1.5rem;
          position: relative;
        }

        @media (max-width: 768px) {
          .map-wrapper {
            height: 25rem;
          }
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 25rem;
        }
        
        .loading-spinner {
          width: 4rem;
          height: 4rem;
          border: 0.25rem solid rgba(0, 117, 191, 0.1);
          border-left: 0.25rem solid var(--azul-medio);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1.25rem;
        }
        
        .loading-text {
          color: #64748b;
          font-size: 1.125rem;
          font-weight: 500;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .universities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(25rem, 100%), 1fr));
          gap: 1.5rem;
        }
        
        .department-card {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
          border-radius: 1.5rem;
          padding: 1.5rem;
          box-shadow: 
            0.75rem 0.75rem 1.5rem rgba(25, 64, 123, 0.08),
            -0.5rem -0.5rem 1rem rgba(255, 255, 255, 0.9);
          border: 0.0625rem solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }
        
        .department-card:hover {
          transform: translateY(-0.25rem);
          box-shadow: 
            1rem 1rem 2rem rgba(25, 64, 123, 0.12),
            -0.75rem -0.75rem 1.5rem rgba(255, 255, 255, 0.95);
        }
        
        .department-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
          padding-bottom: 1rem;
          border-bottom: 0.125rem solid rgba(0, 117, 191, 0.1);
          flex-wrap: wrap;
        }
        
        .department-header svg {
          color: var(--azul-medio);
          background: linear-gradient(145deg, rgba(0, 117, 191, 0.1), rgba(8, 220, 255, 0.1));
          padding: 0.5rem;
          border-radius: 0.75rem;
          box-shadow: 
            0.25rem 0.25rem 0.5rem rgba(25, 64, 123, 0.1),
            -0.125rem -0.125rem 0.25rem rgba(255, 255, 255, 0.8);
          flex-shrink: 0;
        }
        
        .department-title {
          font-size: clamp(1.25rem, 2vw, 1.5rem);
          font-weight: 700;
          color: var(--azul-oscuro);
          flex: 1;
          letter-spacing: -0.01em;
          min-width: 0;
        }
        
        .department-count {
          background: linear-gradient(45deg, var(--azul-medio), var(--azul-claro));
          color: white;
          padding: 0.375rem 0.75rem;
          border-radius: 1.25rem;
          font-size: 0.875rem;
          font-weight: 600;
          box-shadow: 0 0.125rem 0.25rem rgba(0, 117, 191, 0.3);
          white-space: nowrap;
        }
        
        .municipalities-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        
        .municipality-card {
          background: linear-gradient(145deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.8));
          border-radius: 1rem;
          padding: 1.25rem;
          transition: all 0.3s ease;
          border: 0.0625rem solid rgba(255, 255, 255, 0.6);
        }
        
        .municipality-card:hover {
          background: linear-gradient(145deg, rgba(0, 117, 191, 0.05), rgba(8, 220, 255, 0.05));
          transform: translateX(0.25rem);
        }
        
        .municipality-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 0.0625rem solid rgba(0, 117, 191, 0.1);
          flex-wrap: wrap;
        }
        
        .municipality-header svg {
          color: var(--azul-medio);
          background: rgba(0, 117, 191, 0.1);
          padding: 0.25rem;
          border-radius: 0.5rem;
          flex-shrink: 0;
        }
        
        .municipality-title {
          font-size: clamp(1rem, 1.5vw, 1.125rem);
          font-weight: 600;
          color: var(--azul-oscuro);
          flex: 1;
          min-width: 0;
        }
        
        .municipality-count {
          background: rgba(0, 117, 191, 0.1);
          color: var(--azul-medio);
          padding: 0.25rem 0.5rem;
          border-radius: 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
        }
        
        .institutions-list {
          display: grid;
          gap: 0.75rem;
        }
        
        .institution-card {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
          border-radius: 0.75rem;
          padding: 1rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          border: 0.0625rem solid rgba(255, 255, 255, 0.8);
          cursor: pointer;
        }
        
        .institution-card:hover {
          transform: translateY(-0.125rem);
          box-shadow: 
            0.5rem 0.5rem 1rem rgba(25, 64, 123, 0.1),
            -0.25rem -0.25rem 0.5rem rgba(255, 255, 255, 0.9);
        }
        
        .institution-header {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        
        .institution-icon {
          background: linear-gradient(45deg, var(--azul-medio), var(--azul-claro));
          color: white;
          padding: 0.5rem;
          border-radius: 0.625rem;
          flex-shrink: 0;
          box-shadow: 0 0.125rem 0.25rem rgba(0, 117, 191, 0.3);
        }
        
        .institution-info {
          flex: 1;
          min-width: 0;
        }
        
        .institution-name {
          font-size: 1rem;
          font-weight: 600;
          color: var(--azul-oscuro);
          margin-bottom: 0.5rem;
          line-height: 1.4;
          word-wrap: break-word;
        }
        
        .institution-details {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
        }
        
        .institution-code {
          background: rgba(0, 117, 191, 0.1);
          color: var(--azul-medio);
          padding: 0.125rem 0.5rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .institution-type {
          background: rgba(8, 220, 255, 0.1);
          color: var(--azul-oscuro);
          padding: 0.125rem 0.5rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .institution-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent, rgba(0, 117, 191, 0.03), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .institution-card:hover .institution-glow {
          opacity: 1;
        }
        
        .no-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3.75rem 1.25rem;
          text-align: center;
          min-height: 25rem;
        }
        
        .no-results-icon {
          color: #9ca3af;
          margin-bottom: 1.5rem;
          opacity: 0.6;
        }
        
        .no-results-title {
          font-size: clamp(1.25rem, 2vw, 1.5rem);
          font-weight: 600;
          color: var(--azul-oscuro);
          margin-bottom: 0.75rem;
        }
        
        .no-results-text {
          color: #64748b;
          font-size: 1rem;
          max-width: 25rem;
        }
        
        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(18.75rem, 100%), 1fr));
          gap: 1.5rem;
        }
        
        .faq-card {
          background: linear-gradient(145deg, #ffffff, #f8fafc);
          border-radius: 1.25rem;
          overflow: hidden;
          box-shadow: 
            0.75rem 0.75rem 1.5rem rgba(25, 64, 123, 0.1),
            -0.75rem -0.75rem 1.5rem rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
          position: relative;
          padding: 1.5rem;
          min-height: 12.5rem;
          display: flex;
          flex-direction: column;
          border: 0.0625rem solid rgba(255, 255, 255, 0.2);
        }
        
        .faq-card:hover {
          transform: translateY(-0.25rem);
          box-shadow: 
            1rem 1rem 2rem rgba(25, 64, 123, 0.15),
            -1rem -1rem 2rem rgba(255, 255, 255, 0.9);
        }
        
        .faq-card-header {
          margin-bottom: 1rem;
        }
        
        .faq-card-question {
          font-size: clamp(1.125rem, 1.5vw, 1.25rem);
          font-weight: 700;
          color: var(--azul-oscuro);
          margin: 0;
          line-height: 1.4;
          letter-spacing: -0.01em;
        }
        
        .faq-card-body {
          flex: 1;
          display: flex;
          align-items: center;
        }
        
        .faq-card-answer {
          color: #64748b;
          line-height: 1.6;
          margin: 0;
          font-size: 1rem;
        }
        
        .faq-card-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent, rgba(0, 117, 191, 0.05), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .faq-card:hover .faq-card-glow {
          opacity: 1;
        }
        
        .contact-card {
          background: linear-gradient(145deg, #ffffff, #f8fafc);
          border-radius: 1.25rem;
          padding: 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          transition: all 0.3s ease;
          box-shadow: 
            0.75rem 0.75rem 1.5rem rgba(25, 64, 123, 0.1),
            -0.75rem -0.75rem 1.5rem rgba(255, 255, 255, 0.8);
          border: 0.0625rem solid rgba(255, 255, 255, 0.2);
        }
        
        .contact-card:hover {
          transform: translateY(-0.25rem);
          box-shadow: 
            1rem 1rem 2rem rgba(25, 64, 123, 0.15),
            -1rem -1rem 2rem rgba(255, 255, 255, 0.9);
        }
        
        .contact-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
          transition: all 0.3s ease;
          background: linear-gradient(45deg, var(--azul-medio), var(--azul-oscuro));
          box-shadow: 0 0.25rem 0.5rem rgba(0, 117, 191, 0.3);
        }
        
        .contact-card:hover .contact-icon {
          transform: scale(1.1) rotate(5deg);
        }
        
        .contact-title {
          font-size: clamp(1.125rem, 1.5vw, 1.25rem);
          font-weight: 600;
          color: var(--azul-oscuro);
          margin-bottom: 0.5rem;
          letter-spacing: -0.01em;
        }
        
        .contact-text {
          color: #64748b;
          margin-bottom: 0.25rem;
          font-size: 1rem;
        }
        
        .contact-form-container {
          background: linear-gradient(145deg, #ffffff, #f8fafc);
          border-radius: 2rem;
          padding: clamp(1.5rem, 3vw, 3rem);
          box-shadow: 
            1.25rem 1.25rem 2.5rem rgba(25, 64, 123, 0.1),
            -1.25rem -1.25rem 2.5rem rgba(255, 255, 255, 0.8);
          border: 0.0625rem solid rgba(255, 255, 255, 0.2);
        }
        
        .contact-form-title {
          font-size: clamp(1.75rem, 3vw, 2.25rem);
          font-weight: 700;
          color: var(--azul-oscuro);
          margin-bottom: 2rem;
          text-align: center;
          letter-spacing: -0.02em;
        }
        
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(15rem, 100%), 1fr));
          gap: 1rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        .form-label {
          font-weight: 600;
          color: var(--azul-oscuro);
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }
        
        .form-input-neo {
          padding: 1rem;
          border: 0.125rem solid #e5e7eb;
          border-radius: 1rem;
          background: linear-gradient(145deg, #ffffff, #f9fafb);
          color: var(--azul-oscuro);
          font-size: 1rem;
          transition: all 0.3s ease;
          box-shadow: 
            inset 0.25rem 0.25rem 0.5rem rgba(25, 64, 123, 0.05),
            inset -0.25rem -0.25rem 0.5rem rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }
        
        .form-input-neo:focus {
          outline: none;
          border-color: var(--azul-medio);
          box-shadow: 
            inset 0.25rem 0.25rem 0.5rem rgba(25, 64, 123, 0.05),
            inset -0.25rem -0.25rem 0.5rem rgba(255, 255, 255, 0.8),
            0 0 0 0.1875rem rgba(0, 117, 191, 0.1);
        }
        
        .form-textarea {
          resize: vertical;
          min-height: 7.5rem;
        }
        
        .hero-bg-elements {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        
        .bg-element {
          position: absolute;
          border-radius: 50%;
          filter: blur(0.125rem);
          animation: float 15s infinite ease-in-out;
        }
        
        .bg-element-1 {
          width: 12.5rem;
          height: 12.5rem;
          background: linear-gradient(45deg, rgba(0, 117, 191, 0.1), rgba(8, 220, 255, 0.1));
          top: 20%;
          right: 10%;
          animation-delay: 0s;
        }
        
        .bg-element-2 {
          width: 9.375rem;
          height: 9.375rem;
          background: linear-gradient(45deg, rgba(8, 220, 255, 0.1), rgba(25, 64, 123, 0.1));
          bottom: 30%;
          left: 15%;
          animation-delay: -5s;
        }
        
        .bg-element-3 {
          width: 6.25rem;
          height: 6.25rem;
          background: linear-gradient(45deg, rgba(0, 117, 191, 0.1), rgba(8, 220, 255, 0.1));
          top: 60%;
          right: 30%;
          animation-delay: -8s;
        }
        
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-1.25rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes heroEntrance {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes titleSlideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes subtitleFadeIn {
          to {
            opacity: 1;
          }
        }
        
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .hero-title {
            font-size: clamp(2rem, 4vw, 3rem);
          }
          
          .main-title {
            font-size: clamp(2rem, 3.5vw, 2.75rem);
          }
          
          .process-number {
            width: 3rem;
            height: 3rem;
            font-size: 1rem;
          }
          
          .process-icon,
          .benefit-icon {
            width: 3rem;
            height: 3rem;
          }
        }
        
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .requirements-container,
          .contact-form-container {
            padding: 1.5rem;
          }
          
          .faq-grid {
            grid-template-columns: 1fr;
          }
          
          .universities-grid {
            grid-template-columns: 1fr;
          }
          
          .map-container {
            padding: 0.9375rem;
          }
          
          .department-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .municipality-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
          
          .institution-details {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
          
          .contact-card {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 0.75rem;
          }
          
          .contact-icon {
            width: 4rem;
            height: 4rem;
          }
        }
        
        @media (max-width: 480px) {
          .hero-title {
            font-size: clamp(1.75rem, 6vw, 2.5rem);
            margin-bottom: 1rem;
          }
          
          .main-title {
            font-size: clamp(1.75rem, 5vw, 2.25rem);
          }
          
          .contact-form-title {
            font-size: clamp(1.5rem, 4vw, 1.75rem);
          }
          
          .requirement-title {
            font-size: clamp(1.25rem, 3vw, 1.375rem);
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .department-title {
            font-size: clamp(1.125rem, 3vw, 1.25rem);
          }
          
          .process-card,
          .benefit-card {
            padding: 1.25rem;
          }
          
          .process-number {
            width: 2.5rem;
            height: 2.5rem;
            font-size: 0.875rem;
          }
          
          .process-icon,
          .benefit-icon {
            width: 2.5rem;
            height: 2.5rem;
          }
          
          .neo-logo-container {
            max-width: 7rem;
          }
        }
        
        @media (min-width: 1440px) {
          .orb-1 {
            width: 25rem;
            height: 25rem;
          }
          
          .orb-2 {
            width: 18.75rem;
            height: 18.75rem;
          }
          
          .orb-3 {
            width: 12.5rem;
            height: 12.5rem;
          }
          
          .orb-4 {
            width: 20rem;
            height: 20rem;
          }
          
          .orb-5 {
            width: 15rem;
            height: 15rem;
          }
          
          .bg-element-1 {
            width: 18.75rem;
            height: 18.75rem;
          }
          
          .bg-element-2 {
            width: 12.5rem;
            height: 12.5rem;
          }
          
          .bg-element-3 {
            width: 9.375rem;
            height: 9.375rem;
          }
        }
          /* neo-header.css */

/* Estilo general del header fijo */
.neo-header {
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e5e7eb; /* Tailwind gray-200 */
  transition: all 0.4s ease-in-out;
}

/* Cuando el usuario hace scroll */
.neo-header-scrolled {
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(12px);
}

/* Logo del header */
.neo-logo-container img {
  transition: transform 0.3s ease;
}

.neo-logo-container:hover img {
  transform: scale(1.05);
}

/* Botón hamburguesa */
.neo-button-circle {
  background-color: white;
  border-radius: 9999px;
  padding: 0.5rem;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s;
}

.neo-button-circle:hover {
  background-color: #f3f4f6; /* Tailwind gray-100 */
}

/* Enlaces de navegación */
.nav-link-neo {
  font-weight: 500;
  color: #374151; /* Tailwind gray-700 */
  transition: color 0.3s;
}

.nav-link-neo:hover {
  color: #0ea5e9; /* Tailwind sky-500 */
}

/* Mobile menu (menú desplegable) */
.mobile-menu {
  animation: fadeIn 0.4s ease-in-out;
}

/* Animación simple para el menú */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

      `}</style>
    </div>
  );
};

export default Homepage;