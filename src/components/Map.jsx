import { useEffect, useRef } from 'react';

// Cargar Google Maps una sola vez
const loadGoogleMapsScript = () => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve(window.google);
      return;
    }

    // Eliminar cualquier script previo de Google Maps
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDx4-sx2MxIhgWXYgLWxMzWS_SpTj0oy5U`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => resolve(window.google);
    script.onerror = reject;
    
    document.head.appendChild(script);
  });
};

function Map({ latitude, longitude }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Función para inicializar el mapa
    const initMap = async () => {
      try {
        // Asegurarse de que el script de Google Maps está cargado
        const google = await loadGoogleMapsScript();

        // Limpiar el contenedor
        if (mapContainerRef.current) {
          mapContainerRef.current.innerHTML = '';
        }

        const position = { lat: latitude, lng: longitude };

        // Crear nuevo mapa
        const mapOptions = {
          center: position,
          zoom: 15,
          mapTypeControl: false,
          zoomControl: true,
          streetViewControl: false,
          fullscreenControl: false
        };

        mapInstanceRef.current = new google.maps.Map(
          mapContainerRef.current,
          mapOptions
        );

        // Añadir marcador
        new google.maps.Marker({
          position: position,
          map: mapInstanceRef.current,
          animation: google.maps.Animation.DROP
        });

      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();

    // Cleanup
    return () => {
      if (mapContainerRef.current) {
        mapContainerRef.current.innerHTML = '';
      }
      mapInstanceRef.current = null;
    };
  }, [latitude, longitude]);

  return (
    <div 
      ref={mapContainerRef}
      style={{
        width: '100%',
        height: '400px',
        borderRadius: '8px',
        backgroundColor: '#f0f0f0'
      }}
    />
  );
}

export default Map; 