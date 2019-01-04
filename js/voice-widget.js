const voiceWidget = (function() {
  let myStream;
  let inputPoint;
  let scriptProcessor;

  function init(initOptions) {
    const micBtn = document.querySelector("#mic");

    /*** Google Chrome API ***/
    if (window.webkitSpeechRecognition !== undefined) {
      console.log("Chrome API is working");
      var recognition = new webkitSpeechRecognition();

      recognition.interimResults = true;

      recognition.onresult = function(event) {
        console.log(event.results[0][0]);
        let query = event.results[0][0].transcript;
        initOptions.helper.setQuery(query).search(); //Set the query and search
        micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
      };
    } else {
      console.log("Speech recognition Chrome API not supported");

      /*** GCP Speech-To-Text API ***/
      var constraints = {
        audio: {
          mandatory: {
            googEchoCancellation: "false",
            googAutoGainControl: "false",
            googNoiseSuppression: "false",
            googHighpassFilter: "false"
          }
        }
      };

      socket.on("dataFromGCP", data => {
        console.log("dataFromGCP", data);
        let query = data;
        initOptions.helper.setQuery(query).search(); //Set the query and search
      });
    }

    //Start/Stop mic on click
    micBtn.addEventListener("click", function(e) {
      if (myStream) {
        //Stopping the mic
        myStream.getAudioTracks()[0].stop();
        myStream = null;
        scriptProcessor.removeEventListener("audioprocess", streamAudioData);
        micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        socket.emit("endStream", {});
      } else {
        //Starting the mic

        /*** Chrome API ***/
        if (window.webkitSpeechRecognition !== undefined) {
          recognition.start();
        } else {
          /*** GCP Speech-To-Text API ***/
          navigator.mediaDevices
            .getUserMedia(constraints)
            .then(stream => {
              startRecording(stream);
            })
            .catch(function(err) {
              console.log(err.name + ": " + err.message);
            }); // always check for errors at the end.

          micBtn.innerHTML =
            '<i class="fas fa-dot-circle" style="color: red;"></i>';
        }
      }
    });
  }

  function startRecording(stream) {
    socket.emit("startStream", {});

    AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();

    myStream = stream;

    inputPoint = audioContext.createGain();
    const microphone = audioContext.createMediaStreamSource(myStream);
    const analyser = audioContext.createAnalyser();
    scriptProcessor = inputPoint.context.createScriptProcessor(2048, 1, 1);

    microphone.connect(inputPoint);
    inputPoint.connect(analyser);
    inputPoint.connect(scriptProcessor);
    scriptProcessor.connect(inputPoint.context.destination);
    scriptProcessor.addEventListener("audioprocess", streamAudioData);
  }

  function streamAudioData(e) {
    const float32Samples = e.inputBuffer.getChannelData(0);

    socket.emit("audiodata", downsampleBuffer(float32Samples, 44100, 16000));
  }

  function downsampleBuffer(buffer, sampleRate, outSampleRate) {
    if (outSampleRate == sampleRate) {
      return buffer;
    }
    if (outSampleRate > sampleRate) {
      throw "downsampling rate show be smaller than original sample rate";
    }
    var sampleRateRatio = sampleRate / outSampleRate;
    var newLength = Math.round(buffer.length / sampleRateRatio);
    var result = new Int16Array(newLength);
    var offsetResult = 0;
    var offsetBuffer = 0;
    while (offsetResult < result.length) {
      var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      var accum = 0,
        count = 0;
      for (
        var i = offsetBuffer;
        i < nextOffsetBuffer && i < buffer.length;
        i++
      ) {
        accum += buffer[i];
        count++;
      }

      result[offsetResult] = Math.min(1, accum / count) * 0x7fff;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result.buffer;
  }

  return {
    init
  };
})();

window.voiceWidget = new voiceWidget();
