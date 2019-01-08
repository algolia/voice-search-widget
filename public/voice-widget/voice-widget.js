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
    const micBtn = document.querySelector(this.container);

    /*** Google Chrome API ***/
    if (this.isChromeAPIAvailable()) {
      chromeAPI.configureAPI(micBtn, initOptions);
    } else {
      /*** GCP Speech-To-Text API ***/
      gcpAPI.configureAPI(this.socket, initOptions);
    }

    //Start/Stop mic on click
    let that = this;
    micBtn.addEventListener("click", function(e) {
      /*** Chrome API ***/
      if (that.isChromeAPIAvailable()) {
        chromeAPI.startTranscription(micBtn);
      } else {
        if (that.processor == "gcp") {
          /*** GCP Speech-To-Text API ***/
          if (this.isTranscripting) {
            gcpAPI.stopTranscription(micBtn, that.socket);
            this.isTranscripting = false;
          } else {
            gcpAPI.startTranscription(micBtn, that.socket);
            this.isTranscripting = true;
          }
        }
      }
    });
  }

  isChromeAPIAvailable() {
    if (window.webkitSpeechRecognition !== undefined) {
      return true;
    } else {
      return false;
    }
  }
}

export default VoiceWidget;
