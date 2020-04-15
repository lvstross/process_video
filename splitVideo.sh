#!/bin/bash

echo "Video File: $1"

if [ "$1" != "" ]; then
  scenedetect -i $1 -o ./splitClipStation detect-content -t 27 list-scenes save-images split-video
else
  echo "Oops! Please specify a video file name!"
fi
