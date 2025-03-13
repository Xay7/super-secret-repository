import TileLayer from 'ol/layer/Tile';
import { XYZ } from 'ol/source';
import { TileGrid } from 'ol/tilegrid';
import { transformExtent } from 'ol/proj';
import init from '../wasm/lerc-wasm.wasm?url';
import * as Lerc from 'lerc';
import type { ImageTile } from 'ol';
import { useGeoClient } from '../api/client';
import type { ElevatedTileInfo } from '../api/client-types';

/**
 * Creates point cloud layer
 * @returns TileLayer
 */
export async function createElevatedLayer() {
  Lerc.load({ locateFile: () => init });
  const data = await useGeoClient().getElevation();
  const extent = [data.metadata.minX, data.metadata.minY, data.metadata.maxX, data.metadata.maxY];

  const tileLayer = new TileLayer({
    extent: transformExtent(extent, 'EPSG:2176', 'EPSG:3857'),
    properties: {
      name: 'Warstwa wysokościowa',
    },
    source: new XYZ({
      url: data.dataUrl,
      tileSize: data.metadata.tileSize,
      projection: 'EPSG:2176',
      tileGrid: new TileGrid({
        extent: [data.metadata.minX, data.metadata.minY, data.metadata.maxX, data.metadata.maxY],
        resolutions: data.metadata.resolutions,
        tileSize: data.metadata.tileSize,
      }),
      tileLoadFunction: async (tile, src) => {
        const dataUrl = await decodeLercTile(src, data.metadata);
        const imageTile = (tile as ImageTile).getImage() as HTMLImageElement;
        imageTile.src = dataUrl;
      },
    }),
  });

  return tileLayer;
}

/**
 * Decodes an LERC encoded tile and creates image of that tile in dataURL
 * @param src tile source
 * @param metadata tile elevation metadata
 * @returns dataURL
 */
async function decodeLercTile(src: string, metadata: ElevatedTileInfo): Promise<string> {
  const res = await fetch(src);
  const lerc = Lerc.decode(await res.arrayBuffer());

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const width = 512;
  const height = 512;

  canvas.width = width;
  canvas.height = height;

  const pixels = lerc.pixels[0];
  const min = metadata.minVal;
  const max = metadata.maxVal;

  const imageData = context!.createImageData(width, height);
  const data = imageData.data;

  const factor = 255 / (max - min);
  let j = 0;

  for (let i = 0; i < width * height; i++) {
    const pixel = pixels[i];

    let value = (pixel - min) * factor;
    value = Math.max(0, Math.min(255, value));

    if (value === 0) {
      data[j] = 0;
      data[j + 1] = 0;
      data[j + 2] = 0;
      data[j + 3] = 0;
    } else {
      data[j] = value;
      data[j + 1] = value;
      data[j + 2] = 0;
      data[j + 3] = 255;
    }

    j += 4;
  }

  context?.putImageData(imageData, 0, 0);

  return canvas.toDataURL();
}
