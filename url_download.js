require('dotenv/config');
const fs = require('fs');
const lineReader = require('line-reader');
const ytdl = require('ytdl-core');

const YT_DOWNLOAD_DIR = process.env.YT_DOWNLOAD_DIR;
const existingFiles = fs.readdirSync(`./${YT_DOWNLOAD_DIR}`);

var index = 1;
lineReader.eachLine('urls.txt', (line) => {
  const fileName = `video_${index}.mp4`;
  if (!existingFiles.includes(fileName)) {
    console.log(`Downloading: ${line} as ${fileName}`);
    const videoPath = `./${YT_DOWNLOAD_DIR}/${fileName}`;
    if (ytdl.validateURL(line)) {
      ytdl(line).pipe(fs.createWriteStream(videoPath));
      index++;
    }
  } else {
    console.log(`${fileName} already exists!`);
    index++;
  }
});
