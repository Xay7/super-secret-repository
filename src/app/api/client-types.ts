import type { GeoJSONFeature } from 'ol/format/GeoJSON';

export interface TileInfo {
  maxX: number;
  maxY: number;
  minX: number;
  minY: number;
  resolutions: number[];
  tileSize: number;
}

export interface ElevatedTileInfo extends TileInfo {
  maxVal: number;
  minVal: number;
}

export interface DataItem {
  id: number;
  photos_m2m: unknown[];
  tabulars_m2m: unknown[];
  is_active: boolean;
  data_type_fk: number;
  geom: GeoJSONFeature;
  properties: {
    pred_ID: number;
  };
  dataset_fk: number;
  file_fk: number;
  is_2d?: boolean;
}
