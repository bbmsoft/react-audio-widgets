import './App.css';
import React, { useEffect, useState } from 'react';
import ParametricEQ, { BandType } from './components/ParametricEQ';
import Canvas from './components/Canvas';
import SliderEQ from './components/SliderEQ';
import { Button } from '@material-ui/core';
import KnobEqBand from './components/KnobEqBand';

const BACKEND_ADDRESS = "ws://bbmsoft.net:9021/";

const INITIAL_EQ = {
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

function connectToWs(updateEq, setWS) {
  let socket = new WebSocket(BACKEND_ADDRESS);

  socket.onclose = e => {
    alert("Backend connection lost. Click OK to reconnect!");
    setTimeout(() => connectToWs(updateEq, setWS), 500);
  };

  socket.onopen = function (e) {
    console.info("Connected to backend.");
  };

  socket.onerror = function (error) {
    console.error(error.message);
    alert("Backend connection lost. Click OK to reconnect!");
    setTimeout(() => connectToWs(updateEq, setWS), 500);
  };

  socket.onmessage = function (event) {
    const eq = JSON.parse(event.data);
    if (eq && eq.bands) {
      updateEq(eq);
    }
  };

  setWS(socket);
}

function App() {

  const [eq, setEq] = useState(INITIAL_EQ);
  const [ws, setWS] = useState(null);

  window.localEq = eq;
  window.ws = ws;

  const eqReceived = receivedEq => {
    const newEq = { ...receivedEq, activeBand: window.localEq.activeBand };
    if (window.inputLocked) {
      window.remoteEq = newEq;
    } else {
      setEq(newEq);
    }
  }

  const onInput = newEq => {

    if (window.timeout) {
      clearTimeout(window.timeout);
    }

    window.timeout = setTimeout(() => {
      window.inputLocked = false;
      if (window.remoteEq) {
        setEq(window.remoteEq);
        window.remoteEq = null;
      }
    }, 1000);

    window.inputLocked = true;

    setEq({ ...newEq });

    if (!window.sendPending) {
      window.sendPending = setTimeout(() => {
        window.sendPending = null;
        window.ws && window.ws.send(JSON.stringify(window.localEq));
      }, 17);
    }
  };

  useEffect(() => {
    connectToWs(eqReceived, setWS);
  }, []);

  const width = 1600;
  const height = 500;

  const mainEqHeight = 400;

  const noOfMinis = 8;
  const minis = [];
  const miniEqWidth = width / noOfMinis;
  const miniEqHeight = height - mainEqHeight;
  const padding = 20;
  for (let i = 0; i < noOfMinis; i++) {
    minis.push(
      <ParametricEQ
        key={i}
        eq={eq}
        id={`miniEq-${i}`}
        x={i * miniEqWidth + padding}
        y={mainEqHeight + padding}
        width={miniEqWidth - 2 * padding}
        height={miniEqHeight - 2 * padding}
        minimal={true}
      />
    );
  }

  return (
    <div className="App" style={{
      width: `${width}px`,
      margin: "0 auto",
      left: "50%"
    }}>
      <div>
        <Canvas width={width} height={height}>
          <ParametricEQ
            eq={eq}
            id="mainEq"
            x={0}
            y={0}
            width={width}
            height={mainEqHeight}
            onUserInput={onInput}
          />
          {minis}
        </Canvas>
        <SliderEQ
          eq={eq}
          onUserInput={onInput}
        />
      </div>
      <KnobEqBands id={"knobEq"} eq={eq} onUserInput={onInput} />
      <div><Button variant="contained" onClick={() => onInput(INITIAL_EQ)}>Reset</Button></div>
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
