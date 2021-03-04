import './App.css';
import React, { useState } from 'react';
import ParametricEQ, { BandType } from './components/ParametricEQ';
import Canvas from './components/Canvas';
import SliderEQ from './components/SliderEQ';
import { Button } from '@material-ui/core';
import CircularSlider from './components/CircularSlider';

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
        frequency: 400,
        q: 1,
      }, {
        type: BandType.BELL,
        gain: 0.0,
        frequency: 1200,
        q: 1,
      }, {
        type: BandType.BELL,
        gain: 0.0,
        frequency: 3600,
        q: 1,
      }, {
        type: BandType.BELL,
        gain: 0.0,
        frequency: 10800,
        q: 1,
      }
    ]
  }

  const [eq, setEq] = React.useState(initialEq);

  const onUserInput = (eq) => setEq(eq);

  const [slider, setSlider] = useState(50);

  return (
    <div className="App">
      <Canvas width={1600} height={600}>
        <ParametricEQ
          eq={eq}
          id="mainEq"
          x={0}
          y={0}
          width={1600}
          height={600}
          onUserInput={onUserInput}
        />
      </Canvas>
      <SliderEQ
        eq={eq}
        onUserInput={onUserInput}
      />
      <Button variant="outlined" color="primary" onClick={() => setEq(initialEq)}>Reset</Button>
      <CircularSlider min={0} max={100} radius={25} value={slider} onInput={setSlider} />
    </div>
  );
}

export default App;
