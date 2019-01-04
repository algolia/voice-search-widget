var socket = io.connect("http://localhost:8080/");

socket.on("connect", function() {
  // Do stuff when we connect to the server
  console.log("connected");
});

const search = instantsearch({
  appId: "latency",
  apiKey: "6be0576ff61c053d5f9a3225e2a90f76",
  indexName: "instant_search",
  routing: true
});

search.addWidget(
  instantsearch.widgets.hits({
    container: "#hits",
    templates: {
      empty: "No results",
      item: "<em>Hit {{objectID}}</em>: {{{_highlightResult.name.value}}}"
    }
  })
);

search.addWidget(
  instantsearch.widgets.searchBox({
    container: "#search-bar",
    placeholder: "Search for products"
  })
);

search.addWidget(voiceWidget);

search.start();