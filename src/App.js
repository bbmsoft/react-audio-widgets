import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import ParametricEQ from './components/ParametricEQ/ParametricEQ';
import Canvas from './components/Canvas/Canvas';
import SliderEQ from './components/SliderEQ/SliderEQ';
import { Button } from '@material-ui/core';
import KnobEqBand from './components/SliderEQ/KnobEqBand';
import StatusBar, { DISCONNECTED } from './app/components/StatusBar';
import useWebSocket from './app/hooks/ws';

const BACKEND_ADDRESS = "wss://backend.ensemble.bbmsoft.net/";
// const BACKEND_ADDRESS = "ws://localhost:9021/";


const INITIAL_EQ = {
  minFreq: 20,
  maxFreq: 24000,
  minGain: -12,
  maxGain: -12,
  minQ: 0.1,
  maxQ: 10,
  activeBand: 0,
  bands: []
}

function App() {

  const appState = useRef({});

  const [eq, setEq] = useState(INITIAL_EQ);
  const [connectionState, setConnectionState] = useState(DISCONNECTED);

  appState.current.eq = eq;

  const resized = e => {
    setEq({ ...appState.current.eq });
  }

  useEffect(
    () => {
      window.addEventListener('resize', resized);
      return () => window.removeEventListener('resize', resized);
    }
  );

  const eqReceived = receivedEq => {
    const newEq = { ...receivedEq, activeBand: appState.current.eq.activeBand };
    if (appState.current.inputLocked) {
      appState.current.remoteEq = newEq;
    } else {
      setEq(newEq);
    }
  }

  const [sendMessage, closeWs] = useWebSocket(BACKEND_ADDRESS, eqReceived, setConnectionState);

  const onInput = newEq => {

    if (appState.current.timeout) {
      clearTimeout(appState.current.timeout);
    }

    appState.current.timeout = setTimeout(() => {
      appState.current.inputLocked = false;
      if (appState.current.remoteEq) {
        setEq(appState.current.remoteEq);
        appState.current.remoteEq = null;
      }
    }, 200);

    appState.current.inputLocked = true;

    setEq({ ...newEq });

    if (!appState.current.sendPending) {
      appState.current.sendPending = setTimeout(() => {
        appState.current.sendPending = null;
        sendMessage(JSON.stringify({ eqUpdate: appState.current.eq }));
      }, 17);
    }
  };

  const reset = () => {
    sendMessage(JSON.stringify({ command: "reset" }));
  }

  useEffect(() => {
    appState.current.inputLocked = false;
    return closeWs;
    // eslint-disable-next-line
  }, []);


  // const noOfMinis = 6;
  // const minis = [];
  // 
  // for (let i = 0; i < noOfMinis; i++) {
  //   minis.push(
  //     <ParametricEQThumbnail
  //       key={i}
  //       eq={eq}
  //     />
  //   );
  // }

  const bands = [];

  if (eq && eq.bands) {
    for (let i = 0; i < eq.bands.length; i++) {
      bands.push(
        <KnobEqBand key={i} eq={eq} band={i} onInput={onInput} />
      );
    }
  }

  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;

  return (
    <Canvas id="root-canvas" width={vw} height={vh - 4}>

      <div className="App" style={{
        width: "75%",
        margin: "0 auto",
        left: "50%"
      }}>
        <ParametricEQ
          eq={eq}
          id="mainEq"
          onInput={onInput}
        />
        {/* <div style={{ marginBottom: "32px" }}>{minis}</div> */}
        <SliderEQ
          eq={eq}
          onInput={onInput}
        />
        {bands}
        <div><Button variant="contained" onClick={reset}>Reset</Button></div>
      </div>
      <StatusBar status={connectionState} />
    </Canvas >
  );
}


export default App;
