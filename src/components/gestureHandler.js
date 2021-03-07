export function useOnDragY(elementRef, value, callback, converter) {

    if (!window.useOnDragY) {
        window.useOnDragY = new Map();
    }

    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = window.useOnDragY[element.id];

    if (gestureHandler) {
        gestureHandler.value = value;
    } else {
        const newGestureHandler = { element, value, onDragY: { callback, converter } };
        window.useOnDragY[element.id] = newGestureHandler;
        startHandlingGestures(newGestureHandler);
    }
}

export function useOnDragX(elementRef, value, callback, converter) {

    if (!window.useOnDragX) {
        window.useOnDragX = new Map();
    }

    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = window.useOnDragX[element.id];

    if (gestureHandler) {
        gestureHandler.value = value;
    } else {
        const newGestureHandler = { element, value, onDragX: { callback, converter } };
        window.useOnDragX[element.id] = newGestureHandler;
        startHandlingGestures(newGestureHandler);
    }
}

function startHandlingGestures(gestureHandler) {

    if (gestureHandler.onDragY) {
        watchDragY(gestureHandler);
    }

    if (gestureHandler.onDragX) {
        watchDragX(gestureHandler);
    }

    // TODO
}

function watchDragX(gestureHandler) {
    const { element, onDragX } = gestureHandler;
    const { callback, converter } = onDragX;

    const onMouseMove = e => {
        const dragX = e.pageX;
        const valueX = dragX - gestureHandler.dragStartXOffset;
        const newValue = converter ? converter.toValue(valueX) : valueX;
        callback(newValue);
        e.preventDefault();
    };

    const onMouseDown = e => {
        const dragStartX = e.pageX;
        const dragStartValueX = converter ? converter.toUiCoordinate(gestureHandler.value) : gestureHandler.value;
        gestureHandler.dragStartXOffset = dragStartX - dragStartValueX;
        window.addEventListener("mousemove", onMouseMove);
        e.preventDefault();
    }
    const onMouseUp = e => {
        window.removeEventListener("mousemove", onMouseMove);
        e.preventDefault();
    };

    window.addEventListener("mouseup", onMouseUp);
    element.addEventListener("mousedown", onMouseDown);
}

function watchDragY(gestureHandler) {
    const { element, onDragY } = gestureHandler;
    const { callback, converter } = onDragY;

    const onMouseMove = e => {
        const dragY = e.pageY;
        const valueY = dragY - gestureHandler.dragStartYOffset;
        const newValue = converter ? converter.toValue(valueY) : valueY;
        callback(newValue);
        e.preventDefault();
    };

    const onMouseDown = e => {
        const dragStartY = e.pageY;
        const dragStartValueY = converter ? converter.toUiCoordinate(gestureHandler.value) : gestureHandler.value;
        gestureHandler.dragStartYOffset = dragStartY - dragStartValueY;
        window.addEventListener("mousemove", onMouseMove);
        e.preventDefault();
    }
    const onMouseUp = e => {
        window.removeEventListener("mousemove", onMouseMove);
        e.preventDefault();
    };

    window.addEventListener("mouseup", onMouseUp);
    element.addEventListener("mousedown", onMouseDown);
}
