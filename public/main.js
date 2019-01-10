import VoiceWidget from "./voice-widget/voice-widget.js";

var socket = io.connect("http://localhost:8181/");

socket.on("connect", function() {
  console.log("connected");
});

const search = instantsearch({
  indexName: "voice_search_demo",
  searchClient: algoliasearch("XC1DYSAPBX", "3720c40761477e74cb938856acebfa31"),
  routing: true
});

search.addWidget(
  instantsearch.widgets.configure({
    hitsPerPage: 9
  })
);

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
                    <p class="desc">{{{_snippetResult.description.value}}}...</p>
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

search.addWidget(
  instantsearch.widgets.refinementList({
    container: "#brand",
    attribute: "brand",
    limit: 5,
    showMore: true,
    searchable: true,
    searchablePlaceholder: "Search our brands"
  })
);

search.addWidget(
  instantsearch.widgets.refinementList({
    container: "#categories",
    attribute: "categories"
  })
);

search.addWidget(
  instantsearch.widgets.rangeSlider({
    container: "#price",
    attribute: "price"
  })
);

search.start();
