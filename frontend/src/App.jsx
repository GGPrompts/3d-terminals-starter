import React from 'react';
import Scene3D from './components/Scene3D';
import './App.css';

function App() {
  return (
    <div className="app">
      <div className="header">
        <h1>3D Terminals Starter</h1>
        <p>Click any cube to flip and access its terminal</p>
      </div>
      <Scene3D />
    </div>
  );
}

export default App;
