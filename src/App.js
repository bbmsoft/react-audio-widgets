import './App.css';
import React, { useEffect, useState } from 'react';
import ParametricEQ from './components/ParametricEQ';
import ParametricEQThumbnail from './components/ParametricEQThumbnail';
import Canvas from './components/Canvas';
import SliderEQ from './components/SliderEQ';
import { Button } from '@material-ui/core';
import KnobEqBand from './components/KnobEqBand';
import StatusBar, { CONNECTED, CONNECTING, CONNECTION_CLOSED, DISCONNECTED, CONNECTION_ERROR } from './app/components/StatusBar';

const BACKEND_ADDRESS = "ws://bbmsoft.net:9021/";
// const BACKEND_ADDRESS = "ws://localhost:9021/";

function connectToWs(updateEq, setWS, setConnectionState) {
  setConnectionState(CONNECTING);
  let socket = new WebSocket(BACKEND_ADDRESS);

  socket.onclose = e => {
    setConnectionState(CONNECTION_CLOSED);
    setTimeout(() => connectToWs(updateEq, setWS, setConnectionState), 2000);
  };

  socket.onopen = function (e) {
    setConnectionState(CONNECTED);
    console.info("Connected to backend.");
  };

  socket.onerror = function (error) {
    setConnectionState(CONNECTION_ERROR);
    console.error(error.message);
  };

  socket.onmessage = function (event) {
    setConnectionState(CONNECTED);
    const msg = JSON.parse(event.data);
    const eq = msg.eqUpdate;
    if (eq && eq.bands) {
      updateEq(eq);
    }
  };

  setWS(socket);
}

const INITIAL_EQ = {
  minFreq: 200,
  maxFreq: 24000,
  minGain: -12,
  maxGain: -12,
  minQ: 0.1,
  maxQ: 10,
  activeBand: 0,
  bands: []
}

function App() {

  const [eq, setEq] = useState(INITIAL_EQ);
  const [ws, setWS] = useState(null);
  const [connectionState, setConnectionState] = useState(DISCONNECTED);

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
    }, 200);

    window.inputLocked = true;

    setEq({ ...newEq });

    if (!window.sendPending) {
      window.sendPending = setTimeout(() => {
        window.sendPending = null;
        window.ws && window.ws.send(JSON.stringify({ eqUpdate: window.localEq }));
      }, 17);
    }
  };

  const reset = () => {
    if (window.ws) {
      window.ws.send(JSON.stringify({ command: "reset" }));
    }
  }

  useEffect(() => {
    window.inputLocked = false;
    connectToWs(eqReceived, setWS, setConnectionState);
  }, []);

  const width = 1600;
  const height = 400;

  const mainEqHeight = 400;

  const noOfMinis = 6;
  const padding = 25;
  const miniEqWidth = 125;
  const miniEqHeight = (height - (noOfMinis - 1) * padding) / noOfMinis;
  const minis = [];

  const mainEqWidth = width - padding - miniEqWidth;

  const xOffset = width - miniEqWidth;

  for (let i = 0; i < noOfMinis; i++) {
    minis.push(
      <ParametricEQThumbnail
        key={i}
        eq={eq}
        x={xOffset}
        y={i * (miniEqHeight + padding)}
        width={miniEqWidth}
        height={miniEqHeight}
      />
    );
  }

  const bands = [];

  if (eq && eq.bands) {
    for (let i = 0; i < eq.bands.length; i++) {
      bands.push(
        <KnobEqBand key={i} eq={eq} band={i} onInput={onInput} />
      );
    }
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
            width={mainEqWidth}
            height={mainEqHeight}
            onInput={onInput}
          />
          {minis}
        </Canvas>
        <SliderEQ
          eq={eq}
          onInput={onInput}
        />
      </div>
      {bands}
      <div><Button variant="contained" onClick={reset}>Reset</Button></div>
      <StatusBar status={connectionState} />
    </div>
  );
}


export default App;
