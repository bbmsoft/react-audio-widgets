import { useRef } from "react";

export function useMouseDown(elementRef, callback) {

    const handlerRef = useRef(null);
    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = handlerRef.current;
    handlerRef.current = { ...gestureHandler, element, callback };

    if (callback && !gestureHandler) {
        watchMouseDown(element, handlerRef);
    }
}

export function useMouseUp(elementRef, callback) {

    const handlerRef = useRef(null);
    const upListenerRef = useRef(null);
    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = handlerRef.current;
    handlerRef.current = { ...gestureHandler, element, callback };

    if (callback && !gestureHandler) {
        watchMouseUp(element, handlerRef, upListenerRef);
    }
}

export function useDragX(elementRef, value, callback, converter) {

    const handlerRef = useRef(null);
    const mouseUpListenerRef = useRef(null);
    const touchUpListenerRef = useRef(null);
    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = handlerRef.current;
    handlerRef.current = { ...gestureHandler, element, value, callback, converter };

    if (callback && !gestureHandler) {
        watchDragX(element, handlerRef, mouseUpListenerRef, touchUpListenerRef);
    }
}

export function useDragY(elementRef, value, callback, converter) {

    const handlerRef = useRef(null);
    const upListenerRef = useRef(null);
    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = handlerRef.current;
    handlerRef.current = { ...gestureHandler, element, value, callback, converter };

    if (callback && !gestureHandler) {
        watchDragY(element, handlerRef, upListenerRef);
    }
}

export function useDragXY(elementRef, values, callback, converters) {

    const handlerRef = useRef(null);
    const mouseUpListenerRef = useRef(null);
    const touchUpListenerRef = useRef(null);
    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = handlerRef.current;
    handlerRef.current = { ...gestureHandler, element, values, callback, converters };

    if (callback && !gestureHandler) {
        watchDragXY(element, handlerRef, mouseUpListenerRef, touchUpListenerRef);
    }
}

export function useContextMenu(elementRef, callback) {

    const handlerRef = useRef(null);
    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = handlerRef.current;
    handlerRef.current = { ...gestureHandler, element, callback };

    if (callback && !gestureHandler) {
        watchContextMenu(element, handlerRef);
    }
}

function watchMouseDown(element, handlerRef) {

    const mouseListener = e => {

        if (e.button !== 0) {
            return;
        }

        const { callback } = handlerRef.current;

        const x = e.offsetX;
        const y = e.offsetY;
        callback(x, y);
        e.preventDefault();
    }

    const touchListener = e => {

        if (e.changedTouches.length !== 1) {
            return;
        }

        const { callback } = handlerRef.current;
        const touch = e.changedTouches[0];

        const x = touch.clientX;
        const y = touch.clientY;
        const targetBounds = e.target.getBoundingClientRect();
        callback(x - targetBounds.x, y - targetBounds.y);
        e.preventDefault();
    }

    element.addEventListener("mousedown", mouseListener);
    element.addEventListener("touchstart", touchListener);
}

function watchMouseUp(element, handlerRef, upListenerRef) {

    const upListener = e => {

        if (e.button !== 0) {
            return;
        }

        if (upListenerRef.current) {
            window.removeEventListener("mouseup", upListenerRef.current);
        }

        const { callback } = handlerRef.current;

        const x = e.offsetX;
        const y = e.offsetY;
        callback(x, y);
        e.preventDefault();
    }

    const touchListener = e => {

        if (e.changedTouches.length !== 1) {
            return;
        }

        const { callback } = handlerRef.current;
        const touch = e.changedTouches[0];

        const x = touch.clientX;
        const y = touch.clientY;
        const targetBounds = e.target.getBoundingClientRect();
        callback(x - targetBounds.x, y - targetBounds.y);
        e.preventDefault();
    }

    upListenerRef.current = upListener;

    const downListener = e => {

        if (e.button !== 0) {
            return;
        }

        window.addEventListener("mouseup", upListener);
    }

    element.addEventListener("mousedown", downListener);
    element.addEventListener("touchend", touchListener);
}

function watchDragX(element, handlerRef, mouseUpListenerRef, touchUpListenerRef) {

    const onMouseMove = e => {

        if (e.button !== 0) {
            return;
        }

        const gestureHandler = handlerRef.current;
        const { callback, converter, dragStartXOffset } = gestureHandler;
        const dragX = e.pageX;
        const valueX = dragX - dragStartXOffset;
        const newValue = converter ? converter.toValue(valueX) : valueX;
        callback(newValue);
        e.preventDefault();
    };

    const onMouseUp = e => {

        if (e.button !== 0) {
            return;
        }

        if (mouseUpListenerRef.current) {
            window.removeEventListener("mouseup", mouseUpListenerRef.current);
        }

        window.removeEventListener("mousemove", onMouseMove);
        e.preventDefault();
    };

    mouseUpListenerRef.current = onMouseUp;

    const onMouseDown = e => {

        if (e.button !== 0) {
            return;
        }

        const gestureHandler = handlerRef.current;
        const { converter, value } = gestureHandler;
        const dragStartX = e.pageX;
        const dragStartValueX = converter ? converter.toUiCoordinate(value) : value;
        gestureHandler.dragStartXOffset = dragStartX - dragStartValueX;
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        e.preventDefault();
    }

    const onTouchMove = e => {

        if (e.changedTouches.length !== 1) {
            return;
        }

        const gestureHandler = handlerRef.current;
        const touch = e.changedTouches[0];
        const { callback, converter, dragStartXOffset } = gestureHandler;
        const dragX = touch.pageX;
        const valueX = dragX - dragStartXOffset;
        const newValue = converter ? converter.toValue(valueX) : valueX;
        callback(newValue);
        e.preventDefault();
    };

    const onTouchUp = e => {

        if (e.changedTouches.length !== 1) {
            return;
        }

        if (touchUpListenerRef.current) {
            window.removeEventListener("touchend", touchUpListenerRef.current);
        }

        window.removeEventListener("touchmove", onTouchMove);
        e.preventDefault();
    };

    touchUpListenerRef.current = onTouchUp;

    const onTouchDown = e => {

        if (e.changedTouches.length !== 1) {
            return;
        }

        const gestureHandler = handlerRef.current;
        const touch = e.changedTouches[0];
        const { converter, value } = gestureHandler;
        const dragStartX = touch.pageX;
        const dragStartValueX = converter ? converter.toUiCoordinate(value) : value;
        gestureHandler.dragStartXOffset = dragStartX - dragStartValueX;
        window.addEventListener("touchmove", onTouchMove);
        window.addEventListener("touchend", onTouchUp);
        e.preventDefault();
    }

    element.addEventListener("mousedown", onMouseDown);
    element.addEventListener("touchstart", onTouchDown);
}

function watchDragY(element, handlerRef, upListenerRef) {

    const onMouseMove = e => {

        if (e.button !== 0) {
            return;
        }

        const gestureHandler = handlerRef.current;
        const { callback, converter, dragStartYOffset } = gestureHandler;
        const dragY = e.pageY;
        const valueY = dragY - dragStartYOffset;
        const newValue = converter ? converter.toValue(valueY) : valueY;
        callback(newValue);
        e.preventDefault();
    };

    const onMouseUp = e => {

        if (e.button !== 0) {
            return;
        }

        if (upListenerRef.current) {
            window.removeEventListener("mouseup", upListenerRef.current);
        }

        window.removeEventListener("mousemove", onMouseMove);
        e.preventDefault();
    };

    const onMouseDown = e => {

        if (e.button !== 0) {
            return;
        }

        const gestureHandler = handlerRef.current;
        const { value, converter } = gestureHandler;
        const dragStartY = e.pageY;
        const dragStartValueY = converter ? converter.toUiCoordinate(value) : value;
        gestureHandler.dragStartYOffset = dragStartY - dragStartValueY;
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        e.preventDefault();
    }

    element.addEventListener("mousedown", onMouseDown);
}

function watchDragXY(element, handlerRef, mouseUpListenerRef, touchUpListenerRef) {

    const onMouseMove = e => {

        if (e.button !== 0) {
            return;
        }

        const gestureHandler = handlerRef.current;
        const { callback, converters, dragStartXOffset, dragStartYOffset } = gestureHandler;
        const [converterX, converterY] = converters;
        const dragX = e.pageX;
        const dragY = e.pageY;
        const valueX = dragX - dragStartXOffset;
        const valueY = dragY - dragStartYOffset;
        const convertedX = converterX ? converterX.toValue(valueX) : valueX;
        const convertedY = converterY ? converterY.toValue(valueY) : valueY;
        callback(convertedX, convertedY);
        e.preventDefault();
    };

    const onMouseUp = e => {

        if (e.button !== 0) {
            return;
        }

        if (mouseUpListenerRef.current) {
            window.removeEventListener("mouseup", mouseUpListenerRef.current);
        }

        window.removeEventListener("mousemove", onMouseMove);
        e.preventDefault();
    };

    const onMouseDown = e => {

        if (e.button !== 0) {
            return;
        }

        const gestureHandler = handlerRef.current;
        const { converters } = gestureHandler;
        const [converterX, converterY] = converters;

        const [valueX, valueY] = gestureHandler.values;
        const dragStartX = e.pageX;
        const dragStartY = e.pageY;
        const dragStartValueX = converterX ? converterX.toUiCoordinate(valueX) : valueX;
        const dragStartValueY = converterY ? converterY.toUiCoordinate(valueY) : valueY;
        gestureHandler.dragStartXOffset = dragStartX - dragStartValueX;
        gestureHandler.dragStartYOffset = dragStartY - dragStartValueY;
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        e.preventDefault();
    }

    const onTouchMove = e => {

        if (e.changedTouches.length !== 1) {
            return;
        }

        const gestureHandler = handlerRef.current;
        const touch = e.changedTouches[0];
        const { callback, converters, dragStartXOffset, dragStartYOffset } = gestureHandler;
        const [converterX, converterY] = converters;
        const dragX = touch.pageX;
        const dragY = touch.pageY;
        const valueX = dragX - dragStartXOffset;
        const valueY = dragY - dragStartYOffset;
        const convertedX = converterX ? converterX.toValue(valueX) : valueX;
        const convertedY = converterY ? converterY.toValue(valueY) : valueY;
        callback(convertedX, convertedY);
    };

    const onTouchUp = e => {

        if (e.changedTouches.length !== 1) {
            return;
        }

        if (touchUpListenerRef.current) {
            window.removeEventListener("touchend", touchUpListenerRef.current);
        }

        window.removeEventListener("touchmove", onTouchMove);
        e.preventDefault();
    };

    const onTouchDown = e => {

        if (e.changedTouches.length !== 1) {
            return;
        }

        const gestureHandler = handlerRef.current;
        const touch = e.changedTouches[0];
        const { converters } = gestureHandler;
        const [converterX, converterY] = converters;

        const [valueX, valueY] = gestureHandler.values;
        const dragStartX = touch.pageX;
        const dragStartY = touch.pageY;
        const dragStartValueX = converterX ? converterX.toUiCoordinate(valueX) : valueX;
        const dragStartValueY = converterY ? converterY.toUiCoordinate(valueY) : valueY;
        gestureHandler.dragStartXOffset = dragStartX - dragStartValueX;
        gestureHandler.dragStartYOffset = dragStartY - dragStartValueY;
        window.addEventListener("touchmove", onTouchMove);
        window.addEventListener("touchend", onTouchUp);
        e.preventDefault();
    }

    element.addEventListener("mousedown", onMouseDown);
    element.addEventListener("touchstart", onTouchDown);
}

function watchContextMenu(element, handlerRef) {

    const listener = e => {

        const { callback } = handlerRef.current;

        const x = e.offsetX;
        const y = e.offsetY;
        callback(x, y);
        e.preventDefault();
    }

    element.addEventListener("contextmenu", listener);
}