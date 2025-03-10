import { useEffect, useRef } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { createRasterLayers } from './utils/raster-layers';
import { createLercLayers } from './utils/lerc-layers';

const OpenStreetMapComponent = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);

  const layers = createRasterLayers();
  const lerc = createLercLayers();


  useEffect(() => {
    if (mapRef.current === null) return;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        // layers,
        lerc
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });



    map.getView().fit(layers.getExtent())

    mapInstance.current = map;

    return () => map.setTarget(undefined);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '500px' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default OpenStreetMapComponent;
