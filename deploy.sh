#!/bin/bash
npm run build &&
    docker build -t babymotte/react-audio-widgets-demo . &&
    docker push babymotte/react-audio-widgets-demo