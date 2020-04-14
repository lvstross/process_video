require('dotenv/config');
const fs = require('fs');
const { exec } = require('child_process');

const VIDEO_CONCATE_DIR = process.env.VIDEO_CONCATE_DIR;
const VIDEO_UPLOAD_DIR = process.env.VIDEO_UPLOAD_DIR;
const files = fs.readdirSync(`./${VIDEO_CONCATE_DIR}`);

// Clear out file for processing
fs.writeFileSync('clips.txt', '');

// Append clip paths to file
for (let i = 0; i < files.length; i++) {
  fs.appendFileSync('clips.txt', `file ./${VIDEO_CONCATE_DIR}/${files[i]}
`);
}

// Run ffmpeg and concat the clips
const command = `ffmpeg -safe 0 -f concat -i clips.txt -vcodec copy -acodec copy ./${VIDEO_UPLOAD_DIR}/upload.mp4`;
exec(command, (err) => {
  if (err) throw err;
});
