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
    const upListenerRef = useRef(null);
    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = handlerRef.current;
    handlerRef.current = { ...gestureHandler, element, value, callback, converter };

    if (callback && !gestureHandler) {
        watchDragX(element, handlerRef, upListenerRef);
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
    const upListenerRef = useRef(null);
    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = handlerRef.current;
    handlerRef.current = { ...gestureHandler, element, values, callback, converters };

    if (callback && !gestureHandler) {
        watchDragXY(element, handlerRef, upListenerRef);
    }
}

function watchMouseDown(element, handlerRef) {

    const listener = e => {

        if (e.button !== 0) {
            return;
        }

        const { callback } = handlerRef.current;

        const x = e.offsetX;
        const y = e.offsetY;
        callback(x, y);
        e.preventDefault();
    }

    element.addEventListener("mousedown", listener);
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

    upListenerRef.current = upListener;

    const downListener = e => {

        if (e.button !== 0) {
            return;
        }

        window.addEventListener("mouseup", upListener);
    }

    element.addEventListener("mousedown", downListener);
}

function watchDragX(element, handlerRef, upListenerRef) {

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

        if (upListenerRef.current) {
            window.removeEventListener("mouseup", upListenerRef.current);
        }

        window.removeEventListener("mousemove", onMouseMove);
        e.preventDefault();
    };

    upListenerRef.current = onMouseUp;

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

    element.addEventListener("mousedown", onMouseDown);
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

function watchDragXY(element, handlerRef, upListenerRef) {

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

    element.addEventListener("mousedown", onMouseDown);
}