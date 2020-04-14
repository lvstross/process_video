#!/usr/bin/env python
from moviepy.editor import VideoFileClip, concatenate_videoclips
clip1 = VideoFileClip("./clips/clip1.mp4")
clip2 = VideoFileClip("./clips/clip2.mp4")
final_clip = concatenate_videoclips([clip1,clip2])
final_clip.write_videofile("./uploads/my_concatenation.mp4")
