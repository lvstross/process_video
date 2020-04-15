require('dotenv/config');
const fs = require('fs');
const { exec } = require('child_process');

// Specify clips array cut off
const cutOff = process.argv[2];
if (!cutOff) {
  console.log('Please give cut off number');
  process.exit();
}

const VIDEO_CONCATE_DIR = process.env.VIDEO_CONCATE_DIR;
const VIDEO_UPLOAD_DIR = process.env.VIDEO_UPLOAD_DIR;
const files = fs.readdirSync(`./${VIDEO_CONCATE_DIR}`);
const clipsLength = files.length;

function generateRandomArray() {
  let randomNumbers = [];
  const cutOffLength = Number(cutOff);
  const getRandomNumber = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  }
  for (var i = 0;i < cutOffLength;) {
    const index = getRandomNumber(clipsLength);
    if (!randomNumbers.includes(index)) {
      randomNumbers.push(index);
      i++;
    }
  }
  return randomNumbers;
}

const randomClips = generateRandomArray();
console.log('randomClips: ', randomClips);

// Clear out file for processing
fs.writeFileSync('clips.txt', '');

// Append clip paths to file
for (let i = 0; i < randomClips.length; i++) {
  const index = randomClips[i];
  fs.appendFileSync('clips.txt', `file ./${VIDEO_CONCATE_DIR}/${files[index]}
`);
}

const uploadName = `./${VIDEO_UPLOAD_DIR}/upload-${Date.now()}.mp4`;

setTimeout(() => {
  // Run ffmpeg and concat the clips
  const command = `ffmpeg -safe 0 -f concat -i clips.txt -vcodec copy -acodec copy ${uploadName}`;
  exec(command, (err) => {
    if (err) throw err;
  });
  console.log(`Generated ${uploadName}`);
}, 3000);

// As of right now, the generated videos are cliped together imperfectly. My theory
// on this is that the PySceneDetector is cliping these videos imperfectly thus
// resulting in poorly concatinated videos.

// Next Try clipping videos that are manually clipped and not automatically clipped.
// Also concider ditching the clips.txt file in favor of building the ffmpeg string with
// -i <filename> options. This will eliminate the need for a setTimeout and will be
// more predictable. 
