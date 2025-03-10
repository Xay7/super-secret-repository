import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4.js';
import {get as getProjection} from 'ol/proj.js';

const fromProj = "+proj=tmerc +lat_0=0 +lon_0=15 +k=0.999923 +x_0=5500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs";
proj4.defs("EPSG:2176", fromProj);
register(proj4);
const projectedExtent = [5437077.43, 5429210.76, 6169066.23, 6238188.69];
const proj2176 = getProjection('EPSG:2176');
proj2176?.setExtent(projectedExtent);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
