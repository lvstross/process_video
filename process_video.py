#!/usr/bin/env python
import time
import json
import random
from os import listdir
from os.path import isfile, join
from moviepy.editor import VideoFileClip, concatenate_videoclips

# Get all files in clips folder
path = "./clips/"
clipFilePaths = [path + f for f in listdir(path) if isfile(join(path, f))]

# Save used files to json
data = {}
with open('usedFiles.json') as json_file:
    data = json.load(json_file)

# Get passed files used

# Make buffer for while loop so that if there are no more
# clips to be used, stop the loop and log the failure
# allow index failure up to 30 trys. If one is found
# start buffer back at 0

# Get list of video object until duration has passed 6 minutes
indexes = []
clipsUsed = []
videoClips = []
totalDuration = 0
while totalDuration < 360:
    # Generate Random index and get clip by index
    n = random.randint(0, len(clipFilePaths) - 1)
    hasIndexAlready = n in indexes
    # if index has not been used already, save video clip
    if not hasIndexAlready:
        # Use index data
        indexes.append(n)
        # Use clip file path data
        clip = clipFilePaths[n]
        clipsUsed.append(clip)
        data['usedFiles'].append(clip)
        # Use video object data
        videoObject = VideoFileClip(clip).resize(newsize=(1280,720))
        videoClips.append(videoObject)
        totalDuration += videoObject.duration

# Generate video with dynamic file name using current unix timestamp
timeStamp = repr(time.time())
finalClip = concatenate_videoclips(videoClips)
fileName = "upload-" + timeStamp + ".mp4"
finalClip.write_videofile(
    "./uploads/" + fileName,
    temp_audiofile="temp-audio.m4a",
    remove_temp=True, codec="libx264",
    audio_codec="aac"
)

# Get generated video data to save to json
data['generatedUploads'].append({
    'fileName': fileName,
    'totalDuration': totalDuration,
    'clips': clipsUsed
})

with open('usedFiles.json', 'w') as json_file:
    json.dump(data, json_file, indent=2)
