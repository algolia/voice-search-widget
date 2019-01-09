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

        <style>
          #algolia-mic {
            background-color: #d8d8d8;
            border: 1px solid #acaa9f;
            border-radius: 5px;
            width: 46px;
            height: 46px;
            font-size: 15px;
            margin-left: 10px;
          }

          #algolia-search-input{
            padding: 0 10px;
            border-radius: 5px;
            font-size: 14px;
            width: 400px;
            height: 45px;
            border: 1px solid gray;
            outline: none;
          }

          .hidden{
            display: none;
          }
          
          #bars {
            height: 30px;
            width: 40px;
            position: relative;
            left: 50px;
          }
          
          .bar {
           background: #576CF6;
            bottom: 1px;
            height: 3px;
            position: absolute;
            width: 3px;      
            animation: sound 0ms -800ms linear infinite alternate;
          }
          
          @keyframes sound {
            0% {
               opacity: .35;
                height: 3px; 
            }
            100% {
                opacity: 1;       
                height: 28px;        
            }
          }
          
          .bar:nth-child(1)  { left: 1px; animation-duration: 474ms; }
          .bar:nth-child(2)  { left: 5px; animation-duration: 433ms; }
          .bar:nth-child(3)  { left: 9px; animation-duration: 407ms; }
          .bar:nth-child(4)  { left: 13px; animation-duration: 458ms; }
          .bar:nth-child(5)  { left: 17px; animation-duration: 400ms; }
          .bar:nth-child(6)  { left: 21px; animation-duration: 427ms; }
          .bar:nth-child(7)  { left: 25px; animation-duration: 441ms; }
          .bar:nth-child(8)  { left: 29px; animation-duration: 419ms; }
          .bar:nth-child(9)  { left: 33px; animation-duration: 487ms; }
          .bar:nth-child(10) { left: 37px; animation-duration: 442ms; }​
        </style>

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
          if (this.isTranscripting) {
            gcpAPI.stopTranscription(mic, that.socket);
            this.isTranscripting = false;
            mic.innerHTML = '<i class="fas fa-microphone"></i>';
            wave.classList.add("hidden");
            searchInput.style.paddingLeft = "10px";
          } else {
            gcpAPI.startTranscription(mic, that.socket);
            this.isTranscripting = true;
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
