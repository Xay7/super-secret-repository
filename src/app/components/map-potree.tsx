import { useEffect, useRef } from 'react';
import PotreeViewer from '../utils/potree-viewer';
import { useGeoClient } from '../api/client';

const PotreeViewerComponent = () => {
  const geoclient = useGeoClient();
  const potreeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!potreeRef.current) return;
    const viewer = new PotreeViewer(potreeRef.current);

    viewer.loadPointCloud(geoclient.getCloud(), 'cloud');
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={potreeRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default PotreeViewerComponent;
