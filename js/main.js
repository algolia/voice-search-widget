var socket = io.connect("http://localhost:8080/");

socket.on("connect", function() {
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
      item: `
            <div class="item centered">
                <div><img src="{{image}}" alt=""></div>
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
  instantsearch.widgets.searchBox({
    container: "#search-bar",
    placeholder: "Search for products"
  })
);

search.addWidget(voiceWidget);

search.start();