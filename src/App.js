import './App.css';
import React from 'react';
import ParametricEQ, { BandType } from './components/ParametricEQ';
import Canvas from './components/Canvas';
import { EqContext } from './components/EQ';
import SliderEQ from './components/SliderEQ';

function updateFrequency(eq, frequency, i) {
  const band = { ...eq.bands[i], frequency };
  return updateBand(eq, band, i);
}

function updateGain(eq, gain, i) {
  const band = { ...eq.bands[i], gain };
  return updateBand(eq, band, i);
}

function updateQ(eq, q, i) {
  const band = { ...eq.bands[i], q };
  return updateBand(eq, band, i);
}

function updateBand(eq, band, i) {
  const bands = [...eq.bands];
  bands.splice(i, 1, band);
  const newEq = { ...eq, bands };
  return newEq;
}

function updateActiveBand(eq, activeBand) {
  const newEq = { ...eq, activeBand };
  return newEq;
}

function App() {

  const initialEq = {
    minFreq: 200,
    maxFreq: 24000,
    minGain: -12.0,
    maxGain: 12.0,
    minQ: 0.1,
    maxQ: 100.0,
    activeBand: 0,
    bands: [
      {
        type: BandType.BELL,
        gain: 0.0,
        frequency: 500,
        q: 1,
      }, {
        type: BandType.BELL,
        gain: 0.0,
        frequency: 1000,
        q: 1,
      }, {
        type: BandType.BELL,
        gain: 0.0,
        frequency: 2000,
        q: 1,
      }, {
        type: BandType.BELL,
        gain: 0.0,
        frequency: 4000,
        q: 1,
      }, {
        type: BandType.BELL,
        gain: 0.0,
        frequency: 8000,
        q: 1,
      },
    ]
  }

  const [eq, setEq] = React.useState(initialEq);

  const onFrequencyChange = (f, i) => setEq(updateFrequency(eq, f, i));
  const onGainChange = (f, i) => setEq(updateGain(eq, f, i));
  const onQChange = (f, i) => setEq(updateQ(eq, f, i));

  const onActiveBandChange = (i) => setEq(updateActiveBand(eq, i));

  return (
    <div className="App">
      <EqContext.Provider value={eq}>
        <Canvas width={1600} height={600}>
          <ParametricEQ x={0} y={0} width={1600} height={600} />
        </Canvas>
        <SliderEQ
          onFrequencyChange={onFrequencyChange}
          onGainChange={onGainChange}
          onQChange={onQChange}
          onActiveBandChange={onActiveBandChange}
        />
      </EqContext.Provider>
    </div>
  );
}

export default App;
