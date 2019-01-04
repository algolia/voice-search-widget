var binaryServer = require('binaryjs').BinaryServer;
const gcpSpeech = require('@google-cloud/speech');

var server = binaryServer({ port: 8080 });

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

const recognizeStream = gcpClient
    .streamingRecognize(request)
    .on('error', console.error)
    .on('data', (data) => {
        process.stdout.write(
        data.results[0] && data.results[0].alternatives[0]
            ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
            : `\n\nReached transcription time limit, press Ctrl+C\n`
        )
    })
    .on('end', () => {
        console.log("end recognition");
    })

server.on('connection', function (client) {
  console.log('connected');

    client.on('stream', function (stream, meta) {
        console.log()
        stream.on('data', function(chunk){
            recognizeStream.write(chunk);
        });
        stream.on('end', function () {
            console.log('end');
            recognizeStream.end();
        });        
    });

    client.on('close', function () {
        console.log('close')
    });

});