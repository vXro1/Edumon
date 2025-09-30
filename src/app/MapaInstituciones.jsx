'use client'
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AcademicCapIcon, MapPinIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

// Fix para los iconos de Leaflet en Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Crear icono personalizado para las instituciones
const createCustomIcon = (color = '#0075bf', size = 'medium') => {
  const sizes = {
    small: [20, 20],
    medium: [30, 30],
    large: [40, 40]
  };
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${sizes[size][0]}px;
        height: ${sizes[size][1]}px;
        background: linear-gradient(135deg, ${color}, #19407b);
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${size === 'small' ? '8px' : size === 'medium' ? '10px' : '12px'};
      ">
        🎓
      </div>
    `,
    iconSize: sizes[size],
    iconAnchor: [sizes[size][0]/2, sizes[size][1]],
  });
};

const MapaInstituciones = ({ instituciones, loading }) => {
  const [coordenadas, setCoordenadas] = useState([]);
  const [loadingCoords, setLoadingCoords] = useState(false);
  const [geocodingProgress, setGeocodingProgress] = useState(0);

  // Coordenadas aproximadas de departamentos colombianos
  const coordenadasDepartamentos = {
    'Bogotá D.C.': { lat: 4.7110, lng: -74.0721 },
    'Antioquia': { lat: 6.2442, lng: -75.5812 },
    'Valle del Cauca': { lat: 3.4516, lng: -76.5320 },
    'Atlántico': { lat: 10.9685, lng: -74.7813 },
    'Santander': { lat: 7.1254, lng: -73.1198 },
    'Cundinamarca': { lat: 5.0266, lng: -74.2086 },
    'Norte de Santander': { lat: 7.8890, lng: -72.4969 },
    'Boyacá': { lat: 5.4548, lng: -73.3622 },
    'Tolima': { lat: 4.4389, lng: -75.2322 },
    'Huila': { lat: 2.9273, lng: -75.2819 },
    'Cauca': { lat: 2.4387, lng: -76.6147 },
    'Nariño': { lat: 1.2136, lng: -77.2811 },
    'Meta': { lat: 4.1420, lng: -73.6266 },
    'Caldas': { lat: 5.0699, lng: -75.5174 },
    'Risaralda': { lat: 5.3158, lng: -75.9928 },
    'Quindío': { lat: 4.4611, lng: -75.6674 },
    'Córdoba': { lat: 8.7482, lng: -75.8814 },
    'Sucre': { lat: 9.3017, lng: -75.3975 },
    'Bolívar': { lat: 8.6753, lng: -74.9006 },
    'Magdalena': { lat: 10.4240, lng: -74.4056 },
    'La Guajira': { lat: 11.5444, lng: -72.9072 },
    'Cesar': { lat: 9.3132, lng: -73.6533 },
    'Casanare': { lat: 5.7593, lng: -71.9836 },
    'Arauca': { lat: 7.0906, lng: -70.7574 },
    'Vichada': { lat: 4.4234, lng: -69.2697 },
    'Guainía': { lat: 2.5742, lng: -67.9286 },
    'Vaupés': { lat: 1.2500, lng: -70.2369 },
    'Amazonas': { lat: -1.0306, lng: -71.2439 },
    'Putumayo': { lat: 0.5136, lng: -75.5119 },
    'Caquetá': { lat: 1.6145, lng: -75.6062 },
    'Guaviare': { lat: 2.5649, lng: -72.6459 },
    'Chocó': { lat: 5.6969, lng: -76.6589 },
    'San Andrés y Providencia': { lat: 12.5847, lng: -81.7006 }
  };

  const coordenadasMunicipios = {
    // Bogotá D.C.
    'Bogotá D.C.': { lat: 4.7110, lng: -74.0721 },
    
    // Antioquia
    'Medellín': { lat: 6.2442, lng: -75.5812 },
    'Bello': { lat: 6.3370, lng: -75.5547 },
    'Itagüí': { lat: 6.1729, lng: -75.5994 },
    'Envigado': { lat: 6.1699, lng: -75.5947 },
    
    // Valle del Cauca
    'Cali': { lat: 3.4516, lng: -76.5320 },
    'Palmira': { lat: 3.5394, lng: -76.3036 },
    'Buenaventura': { lat: 3.8801, lng: -77.0313 },
    
    // Atlántico
    'Barranquilla': { lat: 10.9685, lng: -74.7813 },
    'Soledad': { lat: 10.9215, lng: -74.7645 },
    'Malambo': { lat: 10.8594, lng: -74.7738 },
    
    // Cauca
    'Popayán': { lat: 2.4387, lng: -76.6147 },
  };

  useEffect(() => {
    if (instituciones && instituciones.length > 0) {
      geocodificarInstituciones();
    }
  }, [instituciones]);

  const geocodificarInstituciones = async () => {
    if (loadingCoords) return;
    
    setLoadingCoords(true);
    setGeocodingProgress(0);
    
    const institucionesConCoordenadas = [];
    
    for (let i = 0; i < instituciones.length; i++) {
      const inst = instituciones[i];
      let coordenada = null;

      try {
        // 1. Intentar con coordenadas predefinidas de municipio
        if (coordenadasMunicipios[inst.municipio]) {
          coordenada = {
            ...inst,
            lat: coordenadasMunicipios[inst.municipio].lat + (Math.random() - 0.5) * 0.1,
            lng: coordenadasMunicipios[inst.municipio].lng + (Math.random() - 0.5) * 0.1
          };
        }
        // 2. Si no, usar coordenadas del departamento
        else if (coordenadasDepartamentos[inst.departamento]) {
          coordenada = {
            ...inst,
            lat: coordenadasDepartamentos[inst.departamento].lat + (Math.random() - 0.5) * 0.5,
            lng: coordenadasDepartamentos[inst.departamento].lng + (Math.random() - 0.5) * 0.5
          };
        }
        // 3. Como último recurso, usar geocodificación de Nominatim
        else {
          const query = `${inst.municipio}, ${inst.departamento}, Colombia`;
          const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
          
          try {
            const response = await fetch(url, {
              headers: { 'User-Agent': 'homologaciones-universitarias-app/1.0' }
            });
            
            if (response.ok) {
              const result = await response.json();
              if (result.length > 0) {
                coordenada = {
                  ...inst,
                  lat: parseFloat(result[0].lat),
                  lng: parseFloat(result[0].lon)
                };
              }
            }
            
            // Delay para no sobrecargar la API
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (error) {
            console.warn(`Error geocodificando ${query}:`, error);
          }
        }

        if (coordenada) {
          institucionesConCoordenadas.push(coordenada);
        }
        
        // Actualizar progreso
        setGeocodingProgress(((i + 1) / instituciones.length) * 100);
        
      } catch (error) {
        console.error(`Error procesando institución ${inst.nombre}:`, error);
      }
    }
    
    setCoordenadas(institucionesConCoordenadas);
    setLoadingCoords(false);
  };

  const getMarkerSize = (departamento) => {
    const count = coordenadas.filter(inst => inst.departamento === departamento).length;
    if (count >= 10) return 'large';
    if (count >= 5) return 'medium';
    return 'small';
  };

  const getMarkerColor = (tipo) => {
    switch (tipo) {
      case 'Técnica o Tecnóloga':
        return '#08dcff';
      case 'Mixta':
        return '#0075bf';
      case 'Universitaria':
        return '#19407b';
      default:
        return '#0075bf';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Cargando instituciones...</p>
      </div>
    );
  }

  if (loadingCoords) {
    return (
      <div className="loading-container">
        <div className="geocoding-progress">
          <div className="geocoding-progress-bar">
            <div 
              className="geocoding-progress-fill" 
              style={{ width: `${geocodingProgress}%` }}
            ></div>
          </div>
          <p className="loading-text">
            Geocodificando instituciones... {Math.round(geocodingProgress)}%
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '600px', width: '100%', borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
      <MapContainer 
        center={[4.5, -74.0]} 
        zoom={6} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {coordenadas.map((inst) => (
          <Marker 
            key={inst.id_institucion} 
            position={[inst.lat, inst.lng]}
            icon={createCustomIcon(getMarkerColor(inst.tipo), getMarkerSize(inst.departamento))}
          >
            <Popup className="custom-popup">
              <div className="popup-content">
                <div className="popup-header">
                  <AcademicCapIcon className="w-5 h-5 text-blue-600" />
                  <h3 className="popup-title">{inst.nombre}</h3>
                </div>
                <div className="popup-details">
                  <div className="popup-detail">
                    <MapPinIcon className="w-4 h-4 text-gray-500" />
                    <span>{inst.municipio}, {inst.departamento}</span>
                  </div>
                  <div className="popup-detail">
                    <BuildingOfficeIcon className="w-4 h-4 text-gray-500" />
                    <span>{inst.tipo}</span>
                  </div>
                  <div className="popup-detail">
                    <span className="popup-code">Código IES: {inst.codigo_ies}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Marcadores de resumen por departamento */}
        {Object.entries(
          coordenadas.reduce((acc, inst) => {
            if (!acc[inst.departamento]) {
              acc[inst.departamento] = [];
            }
            acc[inst.departamento].push(inst);
            return acc;
          }, {})
        ).map(([departamento, instituciones]) => {
          if (instituciones.length < 5) return null;
          
          const centerLat = instituciones.reduce((sum, inst) => sum + inst.lat, 0) / instituciones.length;
          const centerLng = instituciones.reduce((sum, inst) => sum + inst.lng, 0) / instituciones.length;
          
          return (
            <CircleMarker
              key={`cluster-${departamento}`}
              center={[centerLat, centerLng]}
              radius={Math.min(instituciones.length * 2, 30)}
              pathOptions={{
                fillColor: '#0075bf',
                color: '#19407b',
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.3
              }}
            >
              <Popup>
                <div className="cluster-popup">
                  <h4 className="cluster-title">{departamento}</h4>
                  <p className="cluster-count">{instituciones.length} instituciones</p>
                  <div className="cluster-types">
                    {Object.entries(
                      instituciones.reduce((acc, inst) => {
                        acc[inst.tipo] = (acc[inst.tipo] || 0) + 1;
                        return acc;
                      }, {})
                    ).map(([tipo, count]) => (
                      <span key={tipo} className="cluster-type-badge">
                        {tipo}: {count}
                      </span>
                    ))}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Estadísticas del mapa */}
      <div className="map-stats">
        <div className="stat-item">
          <span className="stat-label">Total instituciones:</span>
          <span className="stat-value">{coordenadas.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Departamentos:</span>
          <span className="stat-value">
            {new Set(coordenadas.map(inst => inst.departamento)).size}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Municipios:</span>
          <span className="stat-value">
            {new Set(coordenadas.map(inst => inst.municipio)).size}
          </span>
        </div>
      </div>

      {/* Leyenda del mapa */}
      <div className="map-legend">
        <h4 className="legend-title">Tipos de Institución</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#08dcff' }}></div>
            <span>Técnica o Tecnóloga</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#0075bf' }}></div>
            <span>Mixta</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#19407b' }}></div>
            <span>Universitaria</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }
        
        .loading-spinner {
          width: 64px;
          height: 64px;
          border: 4px solid rgba(0, 117, 191, 0.1);
          border-left: 4px solid #0075bf;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
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
        
        .geocoding-progress {
          width: 100%;
          max-width: 400px;
        }
        
        .geocoding-progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(0, 117, 191, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 16px;
        }
        
        .geocoding-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #0075bf, #08dcff);
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        
        .popup-content {
          min-width: 250px;
        }
        
        .popup-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .popup-title {
          font-weight: 600;
          color: #1f2937;
          margin: 0;
          font-size: 14px;
          line-height: 1.4;
        }
        
        .popup-details {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .popup-detail {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #6b7280;
        }
        
        .popup-code {
          background: rgba(0, 117, 191, 0.1);
          color: #0075bf;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
        }
        
        .cluster-popup {
          text-align: center;
          min-width: 200px;
        }
        
        .cluster-title {
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px 0;
          font-size: 16px;
        }
        
        .cluster-count {
          color: #6b7280;
          margin: 0 0 12px 0;
          font-size: 14px;
        }
        
        .cluster-types {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          justify-content: center;
        }
        
        .cluster-type-badge {
          background: rgba(0, 117, 191, 0.1);
          color: #0075bf;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
        }
        
        .map-stats {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 160px;
          z-index: 1000;
        }
        
        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
        }
        
        .stat-label {
          color: #6b7280;
          font-weight: 500;
        }
        
        .stat-value {
          color: #0075bf;
          font-weight: 600;
        }
        
        .map-legend {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }
        
        .legend-title {
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px 0;
          font-size: 12px;
        }
        
        .legend-items {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #6b7280;
        }
        
        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        @media (max-width: 768px) {
          .map-stats {
            position: relative;
            top: auto;
            right: auto;
            margin-top: 10px;
            flex-direction: row;
            justify-content: space-between;
          }
          
          .map-legend {
            position: relative;
            bottom: auto;
            left: auto;
            margin-top: 10px;
          }
          
          .legend-items {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default MapaInstituciones;