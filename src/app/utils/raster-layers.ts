import TileLayer from "ol/layer/Tile";
import { XYZ } from "ol/source";
import { BASE_PROJECTION } from "../constants";
import { TileGrid } from "ol/tilegrid";
import { transformExtent } from "ol/proj";
import { register } from "ol/proj/proj4";
import proj4 from "proj4";
import {get as getProjection} from 'ol/proj.js';

const metadata = {
    maxX: 5575996.776680001,
    maxY: 5996224.850350001,
    minX: 5575628.781180001,
    minY: 5995889.932830001,
    resolutions: [
      0.7609600000000001,
      0.38048000000000004,
      0.19024000000000002,
      0.09512000000000001,
      0.047560000000000005,
      0.023780000000000003
    ],
    tileSize: 512
  };

  const fromProj = "+proj=tmerc +lat_0=0 +lon_0=15 +k=0.999923 +x_0=5500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs";
  proj4.defs("EPSG:2176", fromProj);
  register(proj4);
const projectedExtent = [5437077.43, 5429210.76, 6169066.23, 6238188.69];
const proj2176 = getProjection('EPSG:2176');
proj2176?.setExtent(projectedExtent);


const extent = [metadata.minX, metadata.minY, metadata.maxX, metadata.maxY]
const test = transformExtent(extent, "EPSG:2176", "EPSG:3857")

export function createRasterLayers() {
    const tileLayer = new TileLayer({
        extent: test,
        source: new XYZ({
            url: "http://localhost:5173/data/6/rasters/500/500/{z}/{x}/{y}.webp",
            tileSize: metadata.tileSize,
            projection: "EPSG:2176",
            tileGrid: new TileGrid({
                extent: extent,
                resolutions: metadata.resolutions,
                tileSize: metadata.tileSize
            })
        }),
        });

        console.log(test)

    return tileLayer;     
}