// Import necessary libraries
import React, { useState } from 'react';
import Papa from 'papaparse';
import './App.css'; // Import custom CSS for styling

function SAGDProductionForecast() {
  // State management
  const [view, setView] = useState('welcome'); // 'welcome', 'wellLog'
  const [data, setData] = useState({
    gammaRayAvg: null,
    neutronDensityAvg: null,
    vmiAvg: null,
    porosityAvg: null,
    permeabilityAvg: null,
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const rows = results.data;

          // Extract numeric columns and calculate averages
          let gammaRaySum = 0,
            neutronDensitySum = 0,
            vmiSum = 0;
          let gammaRayCount = 0,
            neutronDensityCount = 0,
            vmiCount = 0;

          rows.forEach((row) => {
            if (row['Gamma Ray']) {
              gammaRaySum += parseFloat(row['Gamma Ray']);
              gammaRayCount++;
            }
            if (row['Neutron Density']) {
              neutronDensitySum += parseFloat(row['Neutron Density']);
              neutronDensityCount++;
            }
            if (row['VMI']) {
              vmiSum += parseFloat(row['VMI']);
              vmiCount++;
            }
          });

          const gammaRayAvg = gammaRaySum / gammaRayCount;
          const neutronDensityAvg = neutronDensitySum / neutronDensityCount;
          const vmiAvg = vmiSum / vmiCount;
          const porosityAvg = (gammaRayAvg + neutronDensityAvg) / 2;
          const permeabilityAvg = (neutronDensityAvg + vmiAvg) / 2;

          setData({
            gammaRayAvg,
            neutronDensityAvg,
            vmiAvg,
            porosityAvg,
            permeabilityAvg,
          });
        },
      });
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <h1>SAGD Production Forecast</h1>
      </header>

      {/* Views */}
      {view === 'welcome' && (
        <div className="welcome-view">
          <p>Welcome to SAGD Production Forecast Tool!</p>
          <button className="btn" onClick={() => setView('wellLog')}>Well Log</button>
        </div>
      )}

      {view === 'wellLog' && (
        <div className="well-log-view">
          <button className="btn" onClick={() => setView('welcome')}>Back</button>
          <button className="btn">
            <label htmlFor="fileUpload">Import Well Log</label>
          </button>
          <input
            id="fileUpload"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />

          <table className="data-table">
            <thead>
              <tr>
                <th>Well Log</th>
                <th>Average Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Gamma Ray</td>
                <td>{data.gammaRayAvg || 'N/A'}</td>
              </tr>
              <tr>
                <td>Neutron Density</td>
                <td>{data.neutronDensityAvg || 'N/A'}</td>
              </tr>
              <tr>
                <td>VMI</td>
                <td>{data.vmiAvg || 'N/A'}</td>
              </tr>
            </tbody>
          </table>

          <table className="data-table">
            <thead>
              <tr>
                <th>Petrophysical Interpretation</th>
                <th>Average Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Porosity</td>
                <td>{data.porosityAvg || 'N/A'}</td>
              </tr>
              <tr>
                <td>Permeability</td>
                <td>{data.permeabilityAvg || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SAGDProductionForecast;
