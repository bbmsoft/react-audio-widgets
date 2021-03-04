import './App.css';
import React, { useState } from 'react';
import ParametricEQ, { BandType } from './components/ParametricEQ';
import Canvas from './components/Canvas';
import SliderEQ from './components/SliderEQ';
import { Button } from '@material-ui/core';
import KnobEqBand from './components/KnobEqBand';

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

  const [eq, setEq] = useState(initialEq);

  return (
    <div className="App" style={{
      width: "1600px",
      margin: "0 auto",
      left: "50%"
    }}>
      <div>
        <Canvas width={1600} height={600}>
          <ParametricEQ
            eq={eq}
            id="mainEq"
            x={0}
            y={0}
            width={1600}
            height={600}
            onUserInput={setEq}
          />
        </Canvas>
        <SliderEQ
          eq={eq}
          onUserInput={setEq}
        />
      </div>
      <KnobEqBands id={"knobEq"} eq={eq} onUserInput={setEq} />
    </div>
  );
}

function KnobEqBands(props) {
  const { id, eq, onUserInput } = props;

  const bands = [];
  for (let i = 0; i < eq.bands.length; i++) {
    bands.push(
      <KnobEqBand key={i} id={`${id}-${i}`} eq={eq} band={i} onInput={onUserInput} />
    );
  }

  return (
    <div>
      {bands}
    </div>
  );
}

export default App;
