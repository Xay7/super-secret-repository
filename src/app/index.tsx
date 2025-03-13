import { useState, type CSSProperties } from 'react';
import MapPotree from './components/map-potree';
import MapOpenlayers from './components/map-openlayers';

function App() {
  const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D');

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === '3D' ? '2D' : '3D'));
  };

  return (
    <div style={appStyle}>
      <div style={toolbarStyle}>
        <button onClick={toggleViewMode} style={buttonStyle}>
          Zmień widok na {viewMode === '3D' ? '3D' : '2D'}
        </button>
      </div>

      <div style={viewContainerStyle}>{viewMode === '3D' ? <MapOpenlayers /> : <MapPotree />}</div>
    </div>
  );
}

const appStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '100vw',
};

const toolbarStyle: CSSProperties = {
  padding: '10px 20px',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.1)',
};

const buttonStyle: CSSProperties = {
  padding: '10px 20px',
  backgroundColor: 'blue',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  fontSize: '14px',
  cursor: 'pointer',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
};

const viewContainerStyle: CSSProperties = {
  flex: 1,
  width: '100%',
  backgroundColor: '#f0f0f0',
};

export default App;
