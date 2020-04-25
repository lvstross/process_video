#!/usr/bin/env python
import time
import json
import random
import sys
from os import listdir
from os.path import isfile, join
from moviepy.editor import VideoFileClip, concatenate_videoclips

# Get all files in clips folder
path = "./clips/"
clipFilePaths = [path + f for f in listdir(path) if isfile(join(path, f))]

# Get past upload and clips data from json file
data = {}
with open("./json/usedFiles.json") as json_file:
    data = json.load(json_file)

# Get past files used
usedFiles = data["usedFiles"]
availableFiles = []
for file in clipFilePaths:
    hasClipBeenUsed = file in usedFiles
    if not hasClipBeenUsed:
        availableFiles.append(file)

# Make sure there are 50 available clips mininum
if len(availableFiles) < 50:
    print("Process Video Stopped! 50 files required. Only ", len(availableFiles), " are available.")
    sys.exit()

# Get list of video objects until duration has passed 6 minutes
# If video search by available index fails 30 times in a row, script will stop
indexes = []
clipsUsed = []
videoClips = []
buffer = 0
totalDuration = 0
while totalDuration < 360:
    # Generate Random index and get clip by index
    n = random.randint(0, len(availableFiles) - 1)
    hasIndexAlready = n in indexes
    # if index has not been used already, save video clip
    if not hasIndexAlready:
        # Use index data
        indexes.append(n)

        # Use clip file path data
        clip = availableFiles[n]
        clipsUsed.append(clip)
        data["usedFiles"].append(clip)

        # Use video object data
        videoObject = VideoFileClip(clip).resize(newsize=(1280,720))
        videoClips.append(videoObject)
        totalDuration += videoObject.duration
        buffer = 0
    else:
        buffer += 1
        if buffer > 29:
            print("Buffer Point Exceeded: Clip index search was too long. Add more clips!")
            sys.exit()

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

# Get generated video data to save to json file
data["generatedUploads"].append({
    "fileName": fileName,
    "title": "",
    "description": "",
    "uploaded": False,
    "url": "",
    "totalDuration": round(totalDuration / 60, 2),
    "usedCount": len(clipsUsed),
    "currentAvailableCount": len(availableFiles) - len(clipsUsed),
    "clips": clipsUsed
})

# Write video and clip data to json file
with open("./json/usedFiles.json", "w") as json_file:
    json.dump(data, json_file, indent=2)
