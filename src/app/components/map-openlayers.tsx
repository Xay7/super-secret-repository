import { useEffect, useRef, type CSSProperties } from 'react';
import 'ol/ol.css';
import useOlMap from '../hooks/use-map';

const OpenStreetMapComponent = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  const { layers, toggleLayerVisibility, initializeMap, isMapReady, updateLayerOpacity } = useOlMap();

  useEffect(() => {
    const createMap = async () => {
      if (!mapRef.current || isMapReady) return;
      await initializeMap(mapRef.current);
    };

    createMap();
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={panelStyle}>
        <h3 style={{ marginBottom: '15px' }}>Warstwy</h3>
        {isMapReady &&
          layers.map((layer) => (
            <div key={layer.layer.get('name')} style={{ marginBottom: '15px' }}>
              <label>
                <input type="checkbox" checked={layer.visible} onChange={() => toggleLayerVisibility(layer.layer)} />
                {layer.layer.get('name')}
                <input
                  type="range"
                  value={layer.opacity}
                  min="0"
                  max="1"
                  step="0.05"
                  onChange={(e) => updateLayerOpacity(layer.layer, parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </label>
            </div>
          ))}
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};

const panelStyle: CSSProperties = {
  width: '350px',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  padding: '20px', // Increased padding
  zIndex: 10,
  position: 'relative',
  overflowY: 'auto',
};

export default OpenStreetMapComponent;
