class ChromeAPI {
  constructor() {
    this.recognition = null;
  }

  configureAPI(mic, searchInput, wave, initOptions) {
    this.recognition = new webkitSpeechRecognition();
    console.log("Chrome API is working");

    this.recognition.interimResults = true;

    this.recognition.onresult = function(event) {
      console.log(event.results[0][0]);
      let query = event.results[0][0].transcript;
      initOptions.helper.setQuery(query).search(); //Set the query and search
      setTimeout(function(){
        mic.innerHTML = '<i class="fas fa-microphone"></i>';
        wave.classList.add("hidden");
        searchInput.style.paddingLeft = "10px";
      }, 1000);
      searchInput.value = query;
    };
  }

  startTranscription(mic, searchInput) {
    this.recognition.start();
  }
}

export default ChromeAPI;
