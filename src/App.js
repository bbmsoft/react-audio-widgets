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
        gain: 6.0,
        frequency: 400,
        q: 1,
      },
      {
        type: BandType.BELL,
        gain: -8.0,
        frequency: 800,
        q: 10,
      },
      {
        type: BandType.BELL,
        gain: 3.0,
        frequency: 1600,
        q: 3,
      },
      {
        type: BandType.BELL,
        gain: -2.0,
        frequency: 3200,
        q: 0.1,
      }
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
        <Canvas width={800} height={400}>
          <ParametricEQ
            x={0}
            y={0}
            width={800}
            height={400}
            onFrequencyChange={onFrequencyChange}
            onGainChange={onGainChange}
            onQChange={onQChange}
            onActiveBandChange={onActiveBandChange}
          />
        </Canvas>
        <SliderEQ
          onFrequencyChange={onFrequencyChange}
          onGainChange={onGainChange}
          onQChange={onQChange}
          onActiveBandChange={onActiveBandChange}
        />
        {/* <div>
          <button onClick={() => setActiveBand(0)}>{"1"}</button>
          <button onClick={() => setActiveBand(1)}>{"2"}</button>
          <button onClick={() => setActiveBand(2)}>{"3"}</button>
          <button onClick={() => setActiveBand(3)}>{"4"}</button>
          <button onClick={() => setActiveBand(4)}>{"5"}</button>
        </div>
        <div>
          <input type="range" min="1" max="101" onInput={sliderFreqChange} /><br />
          <input type="range" min="1" max="101" onInput={sliderGainChange} /><br />
          <input type="range" min="1" max="101" onInput={sliderQChange} /><br />
        </div> */}
      </EqContext.Provider>
    </div>
  );
}

export default App;
