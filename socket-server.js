var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const gcpSpeech = require('@google-cloud/speech');

var port = process.env.PORT || 8080;

http.listen(port, function () {
    console.log('Server Started. Listening on localhost:' + port);
});

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
  interimResults: true,
};

let recognizeStream = null;

io.on('connection', (socket) => {

    socket.on('startStream', () => { 
        console.log("startStream");
        startRecognitionStream();
    });

    socket.on('audiodata', (data) => { 
        console.log(data);
        if(recognizeStream){
            recognizeStream.write(data);
        }
    });

    socket.on('endStream', () => { 
        console.log("endStream");
        stopRecognitionStream();
    });
});

function startRecognitionStream() {
    recognizeStream = gcpClient.streamingRecognize(request)
        .on('error', console.error)
        .on('data', (data) => {
            process.stdout.write(
                (data.results[0] && data.results[0].alternatives[0])
                    ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
                    : `\n\nReached transcription time limit, press Ctrl+C\n`);
            
            io.emit("dataFromGCP", data.results[0].alternatives[0].transcript);

            // if end of utterance, let's restart stream
            // this is a small hack. After 65 seconds of silence, the stream will still throw an error for speech length limit
            if (data.results[0] && data.results[0].isFinal) {
                stopRecognitionStream();
                startRecognitionStream();
                // console.log('restarted stream serverside');
            }
        });
}

function stopRecognitionStream() {
    if (recognizeStream) {
        recognizeStream.end();
    }
    recognizeStream = null;
}