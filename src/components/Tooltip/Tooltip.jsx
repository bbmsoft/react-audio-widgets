import React from 'react';


const Tooltip = React.forwardRef((props, ref) => {

    let x = props.x || 0;
    let y = props.y || 0;
    let visible = props.visibility;
    let opacity = props.visibility === "hidden" ? 0.0 : 1.0;
    let style = {
        position: "absolute",
        left: x,
        top: y,
        zIndex: 999,
        color: "#aaa",
        backgroundColor: "#111b",
        border: "4px solid #aaa",
        borderRadius: "0.5em",
        padding: "0.5em",
        visibility: visible,
        opacity: opacity,
        transition: "visibility 0.1s linear,opacity 0.1s linear",
        pointerEvents: "none"
    };

    return (
        <div ref={ref} style={style}>
            {props.children}
        </div>
    );
});

export default Tooltip;