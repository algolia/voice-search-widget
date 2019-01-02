var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const gcpSpeech = require('@google-cloud/speech');

var port = process.env.PORT || 8080;

// Start the Server
http.listen(port, function () {
    console.log('Server Started. Listening on localhost:' + port);
});

// Creates a client
const gcpClient = new gcpSpeech.SpeechClient();

const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US';

const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  },
  interimResults: true, // If you want interim results, set this to true
};

const recognizeStream = gcpClient.streamingRecognize(request);

recognizeStream
.on('data', (data) => {
    console.log("onDataThing", data);
    process.stdout.write(
              data.results[0] && data.results[0].alternatives[0]
                ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
                : `\n\nReached transcription time limit, press Ctrl+C\n`
            )
})
.on('error', (error) => {
    console.log("error", error);
});

io.on('connection', (socket) => {
    socket.on('audiodata', (data) => { 
        console.log("audiodata", data);
        recognizeStream.write(data);
    });
});

//recognizeStream.write("ee");


// Create a recognize stream
// const recognizeStream = client
//   .streamingRecognize(request)
//   .on('error', console.error)
//   .on('data', data =>
//     process.stdout.write(
//       data.results[0] && data.results[0].alternatives[0]
//         ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
//         : `\n\nReached transcription time limit, press Ctrl+C\n`
//     )
//   );

// // Start recording and send the microphone input to the Speech API
// record
//   .start({
//     sampleRateHertz: sampleRateHertz,
//     threshold: 0,
//     // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
//     verbose: false,
//     recordProgram: 'rec', // Try also "arecord" or "sox"
//     silence: '10.0',
//   })
//   .on('error', console.error)
//   .pipe(recognizeStream);

// console.log('Listening, press Ctrl+C to stop.');