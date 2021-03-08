import React from 'react';
import './StatusBar.css';

export const DISCONNECTED = "disconnected";
export const CONNECTING = "connecting";
export const CONNECTED = "connected";
export const CONNECTION_CLOSED = "connection-closed";
export const CONNECTION_ERROR = "connection-error";

function StatusBar(props) {

    const { status } = props;

    let text;

    switch (status) {
        case DISCONNECTED:
            text = "Not connected to backend.";
            break;
        case CONNECTING:
            text = "Connecting to backend...";
            break;
        case CONNECTED:
            text = "Connected to backend.";
            break;
        case CONNECTION_CLOSED:
            text = "Connection to backend lost. Reconnecting...";
            break;
        case CONNECTION_ERROR:
            text = "Could not connect to backend.";
            break;
        default:
            text = "Connection state unknown.";
            break;
    }

    return (
        <div className={`status-bar ${status}`}>{text}</div>
    );
}

export default StatusBar;