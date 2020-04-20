#!/bin/bash
echo "inputVideo: $1"
echo "outputVideo: $2"
echo "startTime: $3"
echo "endTime: $4"

if [ "$1" != "" ]; then
  # ffmpeg -i ./downloads/video1.mp4 -ss 2:26.12 -strict -2 -to 2:34.15 ./clips/clip11.mp4
  ffmpeg -i $1 -ss $3 -strict -2 -to $4 $2
else
  echo "Oops! Need arguments."
fi
