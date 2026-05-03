var municipalities = [
  { name:"Daanbantayan", slug:"daanbantayan", x:58.1, y:8 },
  { name:"Medellin", slug:"medellin", x:55.8, y:11.5 },
  { name:"Bogo City", slug:"bogo-city", x:56, y:17 },
  { name:"Tabogon", slug:"tabogon", x:57.3, y:21.2 },
  { name:"San Remigio", slug:"san-remigio", x:52.7, y:20.9 },
  { name:"Tabuelan", slug:"tabuelan", x:50.3, y:25.5 },
  { name:"Tuburan", slug:"tuburan", x:46.5, y:32.5 },
  { name:"Borbon", slug:"borbon", x:56.3, y:25 },
  { name:"Catmon", slug:"catmon", x:54.5, y:33.5 },
  { name:"Sogod", slug:"sogod", x:54.5, y:29 },
  { name:"Carmen", slug:"carmen", x:54.2, y:36.8 },
  { name:"Danao City", slug:"danao-city", x:52.0, y:40 },
  { name:"Compostela", slug:"compostela", x:54.5, y:43.3 },
  { name:"Consolacion", slug:"consolacion", x:53.3, y:47 },
  { name:"Liloan", slug:"liloan", x:53.3, y:44.9 },
  { name:"Alegria", slug:"alegria", x:13.7, y:78.3 },
  { name:"Mandaue City", slug:"mandaue-city", x:52, y:49.3 },
  { name:"Lapu-Lapu City", slug:"lapu-lapu-city", x:55, y:51.5 },
  { name:"Barili", slug:"barili", x:23.7, y:61 },
  { name:"Cordova", slug:"cordova", x:52, y:53 },
  { name:"Cebu City", slug:"cebu-city", x:46.5, y:47.5 },
  { name:"Minglanilla", slug:"minglanilla", x:41, y:52.7 },
  { name:"Talisay City", slug:"talisay-city", x:44, y:52 },
  { name:"Naga City", slug:"naga-city", x:37, y:54.5 },
  { name:"Ronda", slug:"ronda", x:17.7, y:66.3 },
  { name:"San Fernando", slug:"san-fernando", x:34, y:57 },
  { name:"Moalboal", slug:"moalboal", x:17, y:69.9 },
  { name:"Alcantara", slug:"alcantara", x:16, y:67.3 },
  { name:"Carcar City", slug:"carcar-city", x:30.5, y:60.5 },
  { name:"Sibonga", slug:"sibonga", x:27.3, y:65 },
  { name:"Argao", slug:"argao", x:25, y:70 },
  { name:"Dalaguete", slug:"dalaguete", x:21.5, y:76 },
  { name:"Alcoy", slug:"alcoy", x:19.5, y:80 },
  { name:"Boljoon", slug:"boljoon", x:18, y:83.3 },
  { name:"Oslob", slug:"oslob", x:15, y:88 },
  { name:"Badian", slug:"badian", x:16, y:73.4 },
  { name:"Samboan", slug:"samboan", x:9.7, y:90 },
  { name:"Malabuyoc", slug:"malabuyoc", x:12.5, y:82.5 },
  { name:"Ginatilan", slug:"ginatilian", x:11, y:87 },
  { name:"Santander", slug:"santander", x:10, y:93 }
];

var container = document.getElementById("map-container");
var tooltip = document.getElementById("tooltip");
var muniList = document.getElementById("muni-list");

municipalities.forEach(function(m) {
  var dot = document.createElement("div");
  dot.className = "dot";
  dot.style.left = m.x + "%";
  dot.style.top = m.y + "%";

  dot.onclick = function() {
    window.location.href = "games/" + m.slug + ".html";
  };

  dot.addEventListener("mouseenter", function() {
    tooltip.innerText = m.name;
    tooltip.style.display = "block";
  });

  dot.addEventListener("mousemove", function(e) {
    tooltip.style.left = (e.clientX + 12) + "px";
    tooltip.style.top = (e.clientY - 28) + "px";
  });

  dot.addEventListener("mouseleave", function() {
    tooltip.style.display = "none";
  });

  container.appendChild(dot);

  var li = document.createElement("li");
  var a = document.createElement("a");
  a.href = "games/" + m.slug + ".html";
  a.innerText = m.name;
  li.appendChild(a);
  muniList.appendChild(li);
});