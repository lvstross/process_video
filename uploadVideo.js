/**
 * This script uploads a video (specifically `video.mp4` from the current
 * directory) to YouTube,
 *
 * To run this script you have to create OAuth2 credentials and download them
 * as JSON and replace the `credentials.json` file. Then install the
 * */
require('dotenv/config');
const Youtube = require("youtube-api"),
  fs = require("fs"),
  readJson = require("r-json"),
  Lien = require("lien"),
  Logger = require("bug-killer"),
  opn = require("opn"),
  prettyBytes = require("pretty-bytes");

// I downloaded the file from OAuth2 -> Download JSON
const CREDENTIALS = readJson(`./json/${process.env.YOUTUBE_CREDS}`);
const USED_FILES = readJson('./json/usedFiles.json');

let firstAvailableIndex = -1;
const generatedUploads = USED_FILES.generatedUploads.filter((upload, index) => {
  if (!upload.uploaded && firstAvailableIndex === -1) {
    firstAvailableIndex = index;
  }
  return !upload.uploaded;
});

const nextFileToUpload = generatedUploads[0];

// Init lien server
let server = new Lien({
  host: "localhost",
  port: 5000
});

// Authenticate
// You can access the Youtube resources via OAuth2 only.
// https://developers.google.com/youtube/v3/guides/moving_to_oauth#service_accounts
let oauth = Youtube.authenticate({
  type: "oauth",
  client_id: CREDENTIALS.web.client_id,
  client_secret: CREDENTIALS.web.client_secret,
  redirect_url: CREDENTIALS.web.redirect_uris[0]
});

opn(oauth.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/youtube.upload"]
}));

server.addPage("/oauth2callback", lien => {
  Logger.log("Trying to get the token using the following code: " + lien.query.code);
  oauth.getToken(lien.query.code, (err, tokens) => {
    if (err) {
      lien.lien(err, 400);
      return Logger.log(err);
    }

    Logger.log("Got the tokens.");
    oauth.setCredentials(tokens);
    lien.end("The video is being uploaded. Check out the logs in the terminal.");

    var req = Youtube.videos.insert({
      resource: {
        snippet: {
          title: USED_FILES.titles.splice(0, 1),
          description: "Thank you for watching! Which clip made you laugh? Let me know in the comments. Like and subscribe if you enjoyed the video.",
          tags: ['memes', 'challenge', 'funny', 'laugh'],
        },
        status: {
          privacyStatus: "private"
        }
      },
      part: "snippet,status",
      media: {
        body: fs.createReadStream(`./uploads/${nextFileToUpload.fileName}`)
      }
    },
    (err, data) => {
      if (err) {
        console.log('Error: ', err);
        process.exit();
      }
      console.log('Video Uploaded Successfully!');
      USED_FILES.generatedUploads[firstAvailableIndex].uploaded = true;
      USED_FILES.generatedUploads[firstAvailableIndex].url = `https://www.youtube.com/watch?v=${data.id}`;
      USED_FILES.generatedUploads[firstAvailableIndex].title = data.snippet.title;
      USED_FILES.generatedUploads[firstAvailableIndex].description = data.snippet.description;
      fs.writeFileSync('./json/usedFiles.json', JSON.stringify(USED_FILES, null, 2));
      process.exit();
    });

    setInterval(() => {
      Logger.log(`${prettyBytes(req.req.connection._bytesDispatched)} bytes uploaded.`);
    }, 250);
  });
});

// Data returned after video
// Data:  { kind: 'youtube#video',
//   etag: '"nxOHAKTVB7baOKsQgTtJIyGxcs8/PSSEK8twvSrbRXR0qIHl3T3mDBA"',
//   id: 'Il8HQUcVjvQ',
//   snippet:
//    { publishedAt: '2020-04-25T04:24:30.000Z',
//      channelId: 'UCNrIi_92Y0GKWpO0SNTZ_VQ',
//      title: 'Test Video',
//      description:
//       'Thank you for watching! Which clip made you laugh? Let me know in the comments. Like and subscriber if you enjoyed yourself.',
//      thumbnails: { default: [Object], medium: [Object], high: [Object] },
//      channelTitle: 'More Over Memes',
//      tags: [ 'memes', 'challenge', 'funny', 'laugh' ],
//
//      categoryId: '22',
//      liveBroadcastContent: 'none',
//      localized:
//       { title: 'Test Video',
//         description:
//          'Thank you for watching! Which clip made you laugh? Let me know in the comments. Like and subscriber if you enjoyed yourself.' } },
//   status:
//    { uploadStatus: 'uploaded',
//      privacyStatus: 'private',
//      license: 'youtube',
//      embeddable: true,
//      publicStatsViewable: true }
//   }
