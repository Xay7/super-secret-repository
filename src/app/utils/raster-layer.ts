import TileLayer from 'ol/layer/Tile';
import { XYZ } from 'ol/source';
import { TileGrid } from 'ol/tilegrid';
import { transformExtent } from 'ol/proj';
import { useGeoClient } from '../api/client';

/**
 * Creates a raster layer using data from data/6/rasters/500
 * @returns TileLayer
 */

export async function createRasterLayer() {
  const data = await useGeoClient().getRaster();
  const extent = [data.metadata.minX, data.metadata.minY, data.metadata.maxX, data.metadata.maxY];

  const tileLayer = new TileLayer({
    extent: transformExtent(extent, 'EPSG:2176', 'EPSG:3857'),
    properties: {
      name: 'Warstwa rastrowa',
    },
    source: new XYZ({
      url: data.dataUrl,
      tileSize: data.metadata.tileSize,
      projection: 'EPSG:2176',
      tileGrid: new TileGrid({
        extent: extent,
        resolutions: data.metadata.resolutions,
        tileSize: data.metadata.tileSize,
      }),
    }),
  });

  return tileLayer;
}
