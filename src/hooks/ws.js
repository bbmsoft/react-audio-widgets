
import { useRef } from 'react';
import { CONNECTED, CONNECTING, CONNECTION_CLOSED, DISCONNECTED, CONNECTION_ERROR } from '../app/components/StatusBar';

function useWebSocket(address, eqReceived, setConnectionState) {

    const wsRef = useRef(null);

    if (!wsRef.current) {
        connectToWs(address, eqReceived, wsRef, setConnectionState);
    }

    const sendMessage = msg => {
        const ws = wsRef.current;
        if (ws) {
            ws.send(msg);
        }
    };

    const closeWs = () => {
        const ws = wsRef.current;
        if (ws) {
            setConnectionState(DISCONNECTED);
            ws.close();
        }
    };

    return [sendMessage, closeWs];
}

function connectToWs(address, updateEq, wsRef, setConnectionState) {

    setConnectionState(CONNECTING);
    let socket = new WebSocket(address);

    socket.onclose = e => {
        console.info("WS connection closed.");
        setConnectionState(CONNECTION_CLOSED);
        setTimeout(() => connectToWs(updateEq, wsRef, setConnectionState), 2000);
    };

    socket.onopen = function (e) {
        console.info("Connected to backend.");
        setConnectionState(CONNECTED);
    };

    socket.onerror = function (error) {
        console.error(error.message);
        setConnectionState(CONNECTION_ERROR);
    };

    socket.onmessage = function (event) {
        const msg = JSON.parse(event.data);
        const eq = msg.eqUpdate;
        if (eq && eq.bands) {
            updateEq(eq);
        }
    };

    wsRef.current = socket;
}

export default useWebSocket;