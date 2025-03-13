import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';
import { all } from 'ol/loadingstrategy';
import { useGeoClient } from '../api/client';
import VectorLayer from 'ol/layer/Vector';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import type { FeatureLike } from 'ol/Feature';

/**
 * @file Manages logic for creating openlayers vector layers and styling them with style functions
 *
 */

function styleFunctionPagedArea(feature: FeatureLike) {
  return new Style({
    fill: new Fill({
      color: 'rgba(0, 102, 204, 0.6)',
    }),
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 1)',
      width: 3,
    }),
    text: new Text({
      text: feature.get('predID') || '',
      font: 'bold 12px sans-serif',
      fill: new Fill({
        color: 'rgba(255, 255, 255, 1)',
      }),
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.7)',
        width: 3,
      }),
    }),
  });
}

// Style for Area
function styleFunctionArea(feature: FeatureLike) {
  return new Style({
    fill: new Fill({
      color: 'rgba(255, 165, 0, 0.7)',
    }),
    stroke: new Stroke({
      color: 'rgba(255, 69, 0, 1)',
      width: 3,
    }),
    text: new Text({
      text: feature.get('pred_ID') || '',
      font: 'bold 12px sans-serif',
      fill: new Fill({
        color: 'rgba(255, 255, 255, 1)',
      }),
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.7)',
        width: 3,
      }),
    }),
  });
}

export function createAreaVectorLayer() {
  const vectorLayer = new VectorLayer({
    source: new VectorSource({
      url: 'http://localhost:5173/data/6/vectors/2472/2472.geojson',
      format: new GeoJSON({
        dataProjection: 'EPSG:2167',
        featureProjection: 'EPSG:3857',
      }),
      strategy: all,
    }),
    style: styleFunctionArea,
    properties: {
      name: 'Wektor zwykły',
    },
  });

  return vectorLayer;
}

export async function createPagedAreaVectorLayer() {
  var data = await useGeoClient().getPagedGeojson();
  const vectorLayer = new VectorLayer({
    source: new VectorSource({
      features: new GeoJSON({
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      }).readFeatures(data),
      strategy: all,
    }),
    style: styleFunctionPagedArea,
    properties: {
      name: 'Wektor stronicowany',
    },
  });
  return vectorLayer;
}
