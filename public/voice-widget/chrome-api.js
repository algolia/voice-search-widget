class ChromeAPI {
  constructor() {
    this.recognition = null;
  }

  configureAPI(micBtn, initOptions) {
    this.recognition = new webkitSpeechRecognition();
    console.log("Chrome API is working");

    this.recognition.interimResults = true;

    this.recognition.onresult = function(event) {
      console.log(event.results[0][0]);
      let query = event.results[0][0].transcript;
      initOptions.helper.setQuery(query).search(); //Set the query and search
      micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    };
  }

  startTranscription(micBtn) {
    this.recognition.start();
    micBtn.innerHTML = '<i class="fas fa-dot-circle" style="color: red;"></i>';
  }
}

export default ChromeAPI;
