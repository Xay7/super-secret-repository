import type { DataItem, ElevatedTileInfo, TileInfo } from './client-types';

export class GeoClient {
  private baseUrl: string;

  // Could use axios but for exercise will stick to fetch
  constructor(baseUrl: string = 'http://localhost:5173') {
    this.baseUrl = baseUrl;
  }

  async getPagedGeojson() {
    // could be typed, but not necessary for task
    const response = await fetch(`${this.baseUrl}/data/vectors_response.json`);
    const data = await response.json();

    const geojson = {
      type: 'FeatureCollection',
      features: data.results.map((item: DataItem) => ({
        type: 'Feature',
        properties: {
          id: item.id,
          isActive: item.is_active,
          dataTypeFk: item.data_type_fk,
          is2d: item.is_2d,
          predID: item.properties?.pred_ID,
          datasetFk: item.dataset_fk,
          fileFk: item.file_fk,
        },
        geometry: item.geom,
      })),
    };

    return geojson;
  }

  async getRaster(): Promise<{ dataUrl: string; metadata: TileInfo }> {
    const metadataUrl = `${this.baseUrl}/data/6/rasters/500/500/metadata.json`;

    const response = await fetch(metadataUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata from ${metadataUrl}`);
    }

    const metadata: TileInfo = await response.json();

    return {
      dataUrl: `${this.baseUrl}/data/6/rasters/500/500/{z}/{x}/{y}.webp`,
      metadata,
    };
  }

  async getElevation(): Promise<{ dataUrl: string; metadata: ElevatedTileInfo }> {
    const metadataUrl = `${this.baseUrl}/data/6/rasters/499/499/metadata.json`;

    const response = await fetch(metadataUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata from ${metadataUrl}`);
    }

    const metadata: ElevatedTileInfo = await response.json();

    return {
      dataUrl: `${this.baseUrl}/data/6/rasters/499/499/{z}/{x}/{y}.lerc`,
      metadata,
    };
  }

  getCloud() {
    return `${this.baseUrl}/data/6/pointclouds/2473/ept/ept.json`;
  }
}

let client: undefined | GeoClient = undefined;

export function useGeoClient() {
  if (!client) {
    client = new GeoClient();
  }
  return client;
}
