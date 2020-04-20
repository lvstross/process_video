#!/usr/bin/env python
import time
import random
from os import listdir
from os.path import isfile, join
from moviepy.editor import VideoFileClip, concatenate_videoclips

# Get all files in clips folder
path = "./clips/"
clipFilePaths = [path + f for f in listdir(path) if isfile(join(path, f))]
print(len(clipFilePaths) - 1)

# Get random list of indexes
randomClipList = []
for i in range(0,25):
    n = random.randint(0, len(clipFilePaths))
    randomClipList.append(clipFilePaths[n])

# Get list of moviepy video objects
videoClips = []
for clip in randomClipList:
    videoObject = VideoFileClip(clip).resize(newsize=(1280,720))
    videoClips.append(videoObject)

timeStamp = repr(time.time())
finalClip = concatenate_videoclips(videoClips)
finalClip.write_videofile(
    "./uploads/upload-" + timeStamp + ".mp4",
    temp_audiofile="temp-audio.m4a",
    remove_temp=True, codec="libx264",
    audio_codec="aac"
)
