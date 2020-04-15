const { exec } = require('child_process');

// Run ffmpeg and concat the clips
const command = `ffmpeg -safe 0 -f concat -i splitRepair.txt -vcodec copy -acodec copy ./splitClipStation/rp_clip-${Date.now()}.mp4`;
exec(command, (err) => {
  if (err) throw err;
});
