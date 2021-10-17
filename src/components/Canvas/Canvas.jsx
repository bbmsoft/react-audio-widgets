import React from 'react';

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
        const ratio = Math.ceil(window.devicePixelRatio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        setRenderingContext({
            canvasRef,
            context
        });
    }, []);

    const ratio = Math.ceil(window.devicePixelRatio);
    const width = props.width * ratio;
    const height = props.height * ratio;
    const id = props.id;
    const style = {
        width: `${props.width}px`,
        height: `${props.height}px`
    };

    return (
        <CanvasContext.Provider value={renderingContext}>
            <canvas id={id} width={width} height={height} ref={canvasRef} style={style} />
            {props.children}
        </CanvasContext.Provider>
    );
}

export default Canvas;