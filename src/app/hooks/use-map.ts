import { useState } from 'react';
import { Map as OLMap, View } from 'ol';
import type BaseLayer from 'ol/layer/Base';
import { createElevatedLayer } from '../utils/elevated-layer';
import { createRasterLayer } from '../utils/raster-layer';
import { createAreaVectorLayer, createPagedAreaVectorLayer } from '../utils/vector-layers';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';

/**
 * Openlayers map wrapper which stores layer list and visibility
 */
function useOlMap() {
  const map = new OLMap({
    view: new View({
      center: [0, 0],
      zoom: 2,
    }),
  });

  // Layers should be set from map.getLayers().on("add" / "remove")
  const [layers, setLayers] = useState<{ layer: BaseLayer; visible: boolean; opacity: number }[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);

  const toggleLayerVisibility = (layer: BaseLayer) => {
    const newVisibility = !layer.getVisible();
    layer.setVisible(newVisibility);
    setLayers((prevLayers) => prevLayers.map((l) => (l.layer === layer ? { ...l, visible: newVisibility } : l)));
  };

  const updateLayerOpacity = (layer: BaseLayer, newOpacity: number) => {
    console.log(newOpacity);
    layer.setOpacity(newOpacity);
    setLayers((prevLayers) => prevLayers.map((l) => (l.layer === layer ? { ...l, opacity: newOpacity } : l)));
  };

  /**
   * Creates instance of the map
   */
  const initializeMap = async (target: HTMLDivElement) => {
    if (isMapReady) return;
    setLayers([]);
    map.getLayers().clear();
    map.setTarget(target);
    await createLayers();
    setIsMapReady(true);
  };

  /**
   * Creates layers from data folder
   */
  const createLayers = async () => {
    const osm = new TileLayer({ source: new OSM(), properties: { name: 'OSM' } });
    const layer = await createPagedAreaVectorLayer();
    const rasterLayer = await createRasterLayer();
    const elevatedLayer = await createElevatedLayer();
    const vectorLayer = await createAreaVectorLayer();
    if (map && map.getLayers().getLength() === 0) {
      map.addLayer(osm);
      map.addLayer(rasterLayer);
      map.addLayer(elevatedLayer);
      map.addLayer(layer);
      map.addLayer(vectorLayer);

      const currentLayers = map.getLayers().getArray();
      const layerWithState = currentLayers.map((layer) => ({
        layer,
        visible: layer.getVisible(),
        opacity: layer.getOpacity(),
      }));
      setLayers(layerWithState);

      const extent = rasterLayer.getExtent();
      if (extent) {
        map.getView().fit(extent);
      }
    } else {
      console.log('Map instance not found');
    }
  };

  return {
    layers,
    toggleLayerVisibility,
    map,
    initializeMap,
    isMapReady,
    updateLayerOpacity,
  };
}

export default useOlMap;
