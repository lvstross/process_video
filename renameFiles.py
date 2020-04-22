#!/usr/bin/env python
from os import listdir, system
from os.path import isfile, join

path = "./clips/"
clipFilePaths = []
for f in listdir(path):
    if isfile(join(path, f)):
        clipFilePaths.append(path + f)

file = open("renameFiles.sh", "w")
file.write("#!/bin/bash\n\n")

idx = 0
writeString = ''
for f in clipFilePaths:
    newFileName = "./clips/clip" + repr(idx) + ".mp4"
    writeString += "mv" + " " + f + " " + newFileName + "\n"
    idx += 1
print(writeString)
file.write(writeString)
file.close()
# system("bash renameFiles.sh")
# this script is dangerous and may delete files
