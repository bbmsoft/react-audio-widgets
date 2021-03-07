import React, { useRef } from 'react';
import * as uuid from 'uuid';

export const CanvasContext = React.createContext(null);

function Canvas(props) {

    const canvasRef = React.useRef(null);

    const [
        renderingContext,
        setRenderingContext,
    ] = React.useState({ canvasRef });

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        setRenderingContext({
            canvasRef,
            context
        });
    }, []);

    const width = props.width;
    const height = props.height;


    return (
        <CanvasContext.Provider value={renderingContext}>
            <canvas width={width} height={height} ref={canvasRef} />
            {props.children}
        </CanvasContext.Provider>
    );
}

export default Canvas;