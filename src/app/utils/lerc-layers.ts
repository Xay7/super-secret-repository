import TileLayer from "ol/layer/Tile";
import { XYZ } from "ol/source";
import { TileGrid } from "ol/tilegrid";
import { transformExtent } from "ol/proj";
import { register } from "ol/proj/proj4";
import proj4 from "proj4";
import {get as getProjection} from 'ol/proj.js';
import init from '../wasm/lerc-wasm.wasm?url'
import * as Lerc from 'lerc';

Lerc.load({locateFile: () => init})

  
const metadata = {
        "maxVal": 79.9968022888254,
        "maxX": 5575996.799997175,
        "maxY": 5996224.899996664,
        "minVal": 48.30980268219662,
        "minX": 5575628.899997176,
        "minY": 5995889.999996665,
        "resolutions": [
            0.7999999999987306,
            0.3999999999993653,
            0.19999999999968265,
            0.09999999999984133
        ],
        "tileSize": 512
  };

  const fromProj = "+proj=tmerc +lat_0=0 +lon_0=15 +k=0.999923 +x_0=5500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs";
  proj4.defs("EPSG:2176", fromProj);
  register(proj4);
const projectedExtent = [5437077.43, 5429210.76, 6169066.23, 6238188.69];
const proj2176 = getProjection('EPSG:2176');
proj2176?.setExtent(projectedExtent);


const extent = [metadata.minX, metadata.minY, metadata.maxX, metadata.maxY]
const test = transformExtent(extent, "EPSG:2176", "EPSG:3857")

export function createLercLayers() {
    const tileLayer = new TileLayer({
        extent: test,
        source: new XYZ({
            url: "http://localhost:5173/data/6/rasters/499/499/{z}/{x}/{y}.lerc",
            tileSize: metadata.tileSize,
            projection: "EPSG:2176",
            tileGrid: new TileGrid({
                extent: extent,
                resolutions: metadata.resolutions,
                tileSize: metadata.tileSize
            }),
            tileLoadFunction: async (tile,src) => {
                const res = await fetch(src);
                const lerc = Lerc.decode(await res.arrayBuffer());

                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                const width = 512;
                const height = 512;
            
                canvas.width = width;
                canvas.height = height;

                console.log(lerc)
            
                // Array of elevation values width*height.
                const pixels = lerc.pixels[0];
            
                // stats for min, max and no data
                // values for uncompressed elevation
                const stats = lerc.statistics[0];
            
                // set the min and max elevation values set
                // by the layer
                const min = metadata.minVal;
                const max = metadata.maxVal;
                const noDataValue = stats.noDataValue;
            
                // Create a new blank image data object with the specified
                // dimensions.
                const imageData = context!.createImageData(width, height);
            
                // get Uint8ClampedArray representing a one-dimensional array
                // containing the data in the RGBA order, with integer values
                // between 0 and 255 (included).
                const data = imageData.data;
            
                const factor = 256 / (max - min);
                let value = 0;
                let j;
            
                // Loop through elevation array from lerc to generate an
                // image that will be displayed.
                // `pixels` is a flat array of color values and alpha
                // [r, g, b, a, r, g, b, a, ...]
                // We need to iterate through elevation and assign color
                // and alpha values respectively.
                for (let i = 0; i < width * height; i++) {
                  // map tile size is 256x256. Elevation values have a
                  // tile size of 257 so we skip the last elevation
                  // whenever "i" is incremented by 256 to jump to the next row.
                  j = i + Math.floor(i / width);
                  // read the elevation value at the given index from the elevation
                  // array and multiply it by the factor. This will define
                  // the shade of yellow color for the pixel.
                  value = (pixels[j] - min) * factor;

            
                  // create RGBA value for the pixel
                  data[i * 4] = value;
                  data[i * 4 + 1] = value;
                  data[i * 4 + 2] = 0;
                  data[i * 4 + 3] = pixels[i] === noDataValue ? 0 : value;
                }

            
                // The elevation change image and ready for display
                context.putImageData(imageData, 0, 0);
                const dataURL = canvas.toDataURL('image/png');
                tile.getImage().src = dataURL;
            }
        }),
        });


    return tileLayer;     
}