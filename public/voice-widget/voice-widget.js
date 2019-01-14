import ChromeAPI from "./chrome-api.js";
import GcpAPI from "./gcp-api.js";

const chromeAPI = new ChromeAPI();
const gcpAPI = new GcpAPI();

class VoiceWidget {
  constructor(options) {
    Object.assign(this, options);
    this.isTranscripting = false;
  }

  init(initOptions) {
    const voiceSearchContainer = document.querySelector(this.container);

    voiceSearchContainer.innerHTML = `
        <div id="voice-search-content" class="centered">
          <div id="bars" class="hidden">
              <div class="bar"></div>
              <div class="bar"></div>
              <div class="bar"></div>
              <div class="bar"></div>
              <div class="bar"></div>
              <div class="bar"></div>
              <div class="bar"></div>
              <div class="bar"></div>
              <div class="bar"></div>
              <div class="bar"></div>
          </div>
          <div id="search-bar">
            <input id="algolia-search-input" type="text" placeholder="${
              this.placeholder
            }" autocomplete="false" autofocus>
          </div>
          <button id="algolia-mic">
            <i class="fas fa-microphone"></i>
          </button>
        </div>
    `;

    let mic = document.getElementById("algolia-mic");
    let searchInput = document.getElementById("algolia-search-input");
    let wave = document.getElementById("bars");

    /*** Google Chrome API ***/
    if (this._isChromeAPIAvailable()) {
      chromeAPI.configureAPI(mic, searchInput, wave, initOptions);
    } else {
      /*** GCP Speech-To-Text API ***/
      gcpAPI.configureAPI(this.socket, searchInput, initOptions);
    }

    //Stopping the speech recognition if the user stopped talking
    this.socket.on("endSpeechRecognition", (_) => {
      if (that.processor == "gcp") {
        gcpAPI.stopTranscription(this.socket);
      }
      this.isTranscripting = false;
      mic.innerHTML = '<i class="fas fa-microphone"></i>';
      wave.classList.add("hidden");
      searchInput.style.paddingLeft = "10px";
    });

    //Start/Stop mic on click
    let that = this;
    mic.addEventListener("click", function(e) {
      mic.innerHTML = '<i class="fas fa-dot-circle" style="color: red;"></i>';
      wave.classList.remove("hidden");
      searchInput.style.paddingLeft = "55px";
      /*** Chrome API ***/
      if (that._isChromeAPIAvailable()) {
        chromeAPI.startTranscription(mic, searchInput);
      } else {
        if (that.processor == "gcp") {
          /*** GCP Speech-To-Text API ***/
          if (that.isTranscripting) {
            gcpAPI.stopTranscription(that.socket);
            that.isTranscripting = false;
            mic.innerHTML = '<i class="fas fa-microphone"></i>';
            wave.classList.add("hidden");
            searchInput.style.paddingLeft = "10px";
          } else {
            gcpAPI.startTranscription(mic, that.socket);
            that.isTranscripting = true;
          }
        }
      }
    });

    searchInput.addEventListener("keyup", function(e) {
      let value = searchInput.value;
      initOptions.helper.setQuery(value).search(); //Set the query and search
    });
  }

  _isChromeAPIAvailable() {
    if (window.webkitSpeechRecognition !== undefined) {
      return true;
    } else {
      return false;
    }
  }
}

export default VoiceWidget;
