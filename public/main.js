import VoiceWidget from "./voice-widget/voice-widget.js";

var socket = io.connect("http://localhost:8181/");

socket.on("connect", function() {
  console.log("connected");
});

const search = instantsearch({
  indexName: "instant_search",
  searchClient: algoliasearch('latency', '6be0576ff61c053d5f9a3225e2a90f76'),
  routing: true
});

search.addWidget(
  instantsearch.widgets.hits({
    container: "#hits",
    templates: {
      empty: "No results",
      item: `
            <div class="item">
                <div class="centered"><img src="{{image}}" alt=""></div>
                <div class="item-content">
                    <p class="name">{{{_highlightResult.name.value}}}</p>
                    <p class="desc">{{{_highlightResult.description.value}}}</p>
                    <p class="price">Price: {{{price}}}</p>
                </div>
            </div>
            <br>`
    }
  })
);

search.addWidget(
  new VoiceWidget({
    container: "#voice-search",
    placeholder: "Search for products and brands",
    socket: socket,
    processor: "gcp"
  })
);

search.addWidget(
  instantsearch.widgets.pagination({
    container: "#pagination"
  })
);

search.addWidget(
  instantsearch.widgets.stats({
    container: "#stats-container"
  })
);

search.start();
